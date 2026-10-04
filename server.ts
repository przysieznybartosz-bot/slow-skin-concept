import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";
import { getKnowledgeBaseTextContext } from "./src/knowledgeBase";

dotenv.config();

// Helper to manage persistent OpenAI API Key on the server across sessions
function getOpenaiApiKey(): string {
  // 1. Try process.env
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY.trim();
  }
  // 2. Try reading from a local file
  try {
    const keyPath = path.join(process.cwd(), "openai_key.txt");
    if (fs.existsSync(keyPath)) {
      const fileKey = fs.readFileSync(keyPath, "utf-8").trim();
      if (fileKey) {
        return fileKey;
      }
    }
  } catch (err) {
    console.error("Error reading openai_key.txt fallback:", err);
  }
  return "";
}

function saveOpenaiApiKey(key: string) {
  try {
    const trimmed = key.trim();
    // Save to openai_key.txt
    const keyPath = path.join(process.cwd(), "openai_key.txt");
    fs.writeFileSync(keyPath, trimmed, "utf-8");
    // Also update in-memory process.env
    process.env.OPENAI_API_KEY = trimmed;
    
    // Also append/update in .env file if possible
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
    }
    
    if (envContent.includes("OPENAI_API_KEY=")) {
      envContent = envContent.replace(/OPENAI_API_KEY=.*/, `OPENAI_API_KEY="${trimmed}"`);
    } else {
      envContent += `\nOPENAI_API_KEY="${trimmed}"\n`;
    }
    fs.writeFileSync(envPath, envContent.trim() + "\n", "utf-8");
  } catch (err) {
    console.error("Error saving openai api key on server:", err);
  }
}

function deleteOpenaiApiKey() {
  try {
    const keyPath = path.join(process.cwd(), "openai_key.txt");
    if (fs.existsSync(keyPath)) {
      fs.unlinkSync(keyPath);
    }
    delete process.env.OPENAI_API_KEY;
    
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf-8");
      // Remove any lines matching OPENAI_API_KEY
      envContent = envContent.split("\n")
        .filter(line => !line.trim().startsWith("OPENAI_API_KEY="))
        .join("\n");
      fs.writeFileSync(envPath, envContent.trim() + "\n", "utf-8");
    }
  } catch (err) {
    console.error("Error deleting openai api key on server:", err);
  }
}

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it to your Secrets in AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Endpoint to allow uploading and saving user's exact original hero photo directly to disk
  app.post("/api/upload-hero-image", (req, res) => {
    try {
      const { dataUrl, filename } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: "Brak danych pliku (dataUrl)" });
      }
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Nieprawidłowy format base64" });
      }
      const buffer = Buffer.from(matches[2], "base64");
      
      // Save to public/hero-main.png so it is statically served at /hero-main.png
      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const publicFile = path.join(publicDir, "hero-main.png");
      fs.writeFileSync(publicFile, buffer);

      // Also save to src/assets/images/hero-main.png
      const srcImagesDir = path.join(process.cwd(), "src", "assets", "images");
      if (!fs.existsSync(srcImagesDir)) {
        fs.mkdirSync(srcImagesDir, { recursive: true });
      }
      fs.writeFileSync(path.join(srcImagesDir, "hero-main.png"), buffer);

      console.log(`[Upload] Pomyślnie zapisano oryginalne zdjęcie Hero: ${publicFile} (${buffer.length} bajtów)`);
      return res.json({ success: true, url: "/hero-main.png?v=" + Date.now() });
    } catch (err: any) {
      console.error("[Upload] Błąd podczas zapisywania zdjęcia:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Endpoint to allow uploading and saving user's exact original treatment photos directly to disk
  app.post("/api/upload-treatment-image", (req, res) => {
    try {
      const { dataUrl, treatmentKey } = req.body;
      if (!dataUrl || !treatmentKey) {
        return res.status(400).json({ error: "Brak danych pliku lub klucza zabiegu" });
      }
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Nieprawidłowy format base64" });
      }
      const buffer = Buffer.from(matches[2], "base64");
      
      const filenameMap: Record<string, string> = {
        "hero": "hero-main.png",
        "cover": "cover_magazine.png",
        "cover_magazine": "cover_magazine.png",
        "pst-couch": "pst_couch.png",
        "pst-chair": "pst_chair.png",
        "ceragem": "ceragem_bed.png",
        "sonaris-pro": "sonaris_pro.png",
        "stymulatory": "stymulatory_tkankowe.png"
      };

      const filename = filenameMap[treatmentKey] || `${treatmentKey}.png`;
      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicDir, filename), buffer);

      // Also write immediately to dist if it exists (so production serves it without needing rebuild)
      const distDir = path.join(process.cwd(), "dist");
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, filename), buffer);
      }

      const srcImagesDir = path.join(process.cwd(), "src", "assets", "images");
      if (fs.existsSync(srcImagesDir)) {
        fs.writeFileSync(path.join(srcImagesDir, filename), buffer);
      }
      const distSrcImagesDir = path.join(process.cwd(), "dist", "src", "assets", "images");
      if (fs.existsSync(distSrcImagesDir)) {
        fs.writeFileSync(path.join(distSrcImagesDir, filename), buffer);
      }

      console.log(`[Upload] Zapisano oryginalne zdjęcie dla ${treatmentKey}: ${filename} (${buffer.length} bajtów)`);
      return res.json({ success: true, url: `/${filename}?v=${Date.now()}` });
    } catch (err: any) {
      console.error("[Upload] Błąd podczas zapisywania zdjęcia zabiegu:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Health check route for production monitoring and Cloud Run probes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Slow Skin Concept", timestamp: new Date().toISOString() });
  });

  // Helper functions for calendar scheduling and collision prevention
  const CALENDAR_BOOKINGS_FILE = path.join(process.cwd(), "bookings_db.json");

  interface StoredBooking {
    id: string;
    treatmentName: string;
    durationMinutes: number;
    price: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    dateStr: string; // YYYY-MM-DD
    timeStr: string; // HH:MM
    notes?: string;
    isOnlineConsultation?: boolean;
    createdAt: string;
  }

  function getStoredBookings(): StoredBooking[] {
    try {
      if (fs.existsSync(CALENDAR_BOOKINGS_FILE)) {
        const raw = fs.readFileSync(CALENDAR_BOOKINGS_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error reading bookings_db.json:", e);
    }
    // Return sample seeded bookings for realistic salon schedule demonstration
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    
    // Tomorrow
    const tom = new Date(now);
    tom.setDate(tom.getDate() + 1);
    const tomStr = `${tom.getFullYear()}-${pad(tom.getMonth() + 1)}-${pad(tom.getDate())}`;

    // Day after tomorrow
    const dat = new Date(now);
    dat.setDate(dat.getDate() + 2);
    const datStr = `${dat.getFullYear()}-${pad(dat.getMonth() + 1)}-${pad(dat.getDate())}`;

    const seed: StoredBooking[] = [
      {
        id: "seed-1",
        treatmentName: "Skin Readiness™ — Diagnoza Komputerowa",
        durationMinutes: 90,
        price: "400 PLN",
        clientName: "Joanna M.",
        clientPhone: "+48 600 *** ***",
        clientEmail: "j.m@example.com",
        dateStr: tomStr,
        timeStr: "11:00",
        notes: "Stała klientka",
        createdAt: new Date().toISOString(),
      },
      {
        id: "seed-2",
        treatmentName: "Neurolifting — Fale Nogiera",
        durationMinutes: 90,
        price: "500 PLN",
        clientName: "Ewa K.",
        clientPhone: "+48 501 *** ***",
        clientEmail: "e.k@example.com",
        dateStr: tomStr,
        timeStr: "15:00",
        notes: "Wizyta cykliczna",
        createdAt: new Date().toISOString(),
      },
      {
        id: "seed-3",
        treatmentName: "Lift & Firm Therapy™",
        durationMinutes: 75,
        price: "500 PLN",
        clientName: "Magdalena W.",
        clientPhone: "+48 692 *** ***",
        clientEmail: "m.w@example.com",
        dateStr: datStr,
        timeStr: "10:30",
        notes: "Konsultacja barierowa",
        createdAt: new Date().toISOString(),
      },
    ];

    try {
      fs.writeFileSync(CALENDAR_BOOKINGS_FILE, JSON.stringify(seed, null, 2), "utf-8");
    } catch {}
    return seed;
  }

  function saveStoredBookings(bookings: StoredBooking[]) {
    try {
      fs.writeFileSync(CALENDAR_BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
    } catch (e) {
      console.error("Error saving bookings_db.json:", e);
    }
  }

  function timeToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  }

  function minutesToTime(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  // Calendar info & bookings endpoint
  app.get("/api/calendar/info", (req, res) => {
    res.json({
      googleAccount: "slowskinconcept@gmail.com",
      calendarId: "ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com",
      status: "connected",
      operatingHours: {
        weekdays: "10:00 — 19:30",
        saturday: "Nieczynne (zablokowane)",
        sunday: "Nieczynne (regeneracja komórkowa)",
      },
      bufferMinutes: 15,
    });
  });

  // Calculate dynamic slots tailored to treatment duration with collision prevention
  app.get("/api/calendar/slots", (req, res) => {
    try {
      const dateStr = (req.query.date as string) || "";
      const duration = parseInt(req.query.duration as string, 10) || 75;
      const bufferMinutes = 15; // 15 min disinfection & room prep

      if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return res.status(400).json({ error: "Nieprawidłowy format daty (wymagany YYYY-MM-DD)." });
      }

      const [year, month, day] = dateStr.split("-").map(Number);
      const reqDate = new Date(year, month - 1, day);
      const dayOfWeek = reqDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

      // Check if Sunday (closed)
      if (dayOfWeek === 0) {
        return res.json({
          date: dateStr,
          isClosed: true,
          dayName: "Niedziela",
          reason: "W niedziele Instytut Slow Skin Concept jest nieczynny — dzień regeneracji komórkowej i wyciszenia.",
          slots: [],
        });
      }

      // Check if Saturday (closed / blocked)
      if (dayOfWeek === 6) {
        return res.json({
          date: dateStr,
          isClosed: true,
          dayName: "Sobota",
          reason: "W soboty gabinet jest nieczynny (terminy zablokowane). Zapraszamy od poniedziałku do piątku w godzinach 10:00 — 19:30.",
          slots: [],
        });
      }

      // Salon hours: Mon-Fri 10:00 — 19:30
      const openMinutes = 10 * 60; // 10:00 rano
      const closeMinutes = 19 * 60 + 30; // 19:30

      // Fetch existing bookings for this date
      const allBookings = getStoredBookings();
      const dayBookings = allBookings.filter((b) => b.dateStr === dateStr);

      // Booked intervals: [startMin, endMin]
      const bookedIntervals = dayBookings.map((b) => {
        const start = timeToMinutes(b.timeStr);
        const end = start + (b.durationMinutes || 75) + bufferMinutes;
        return {
          start,
          end,
          treatment: b.treatmentName,
          client: b.clientName,
        };
      });

      // Generate slots every 30 minutes from open (10:00) to close (19:30)
      const slots: any[] = [];
      const requiredBlock = duration + bufferMinutes;

      for (let m = openMinutes; m + duration <= closeMinutes; m += 30) {
        const slotStart = m;
        const slotEnd = slotStart + duration;
        const slotBlockEnd = slotStart + requiredBlock;

        // Collision check: overlaps if slotStart < bookedEnd && slotBlockEnd > bookedStart
        const collidingBooking = bookedIntervals.find(
          (b) => slotStart < b.end && slotBlockEnd > b.start
        );

        const isAvailable = !collidingBooking && slotBlockEnd <= closeMinutes + bufferMinutes;

        slots.push({
          time: minutesToTime(slotStart),
          endTime: minutesToTime(slotEnd),
          durationMinutes: duration,
          bufferMinutes,
          isAvailable,
          reason: isAvailable
            ? "Wolny termin"
            : collidingBooking
            ? `Zajęty: w trakcie innej terapii (${collidingBooking.treatment})`
            : "Poza godzinami pracy gabinetu",
        });
      }

      res.json({
        date: dateStr,
        dayName: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][dayOfWeek],
        isClosed: false,
        durationMinutes: duration,
        bufferMinutes,
        salonHours: "10:00 — 19:30 (Pon–Pt)",
        totalSlots: slots.length,
        availableSlotsCount: slots.filter((s) => s.isAvailable).length,
        slots,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Błąd generowania slotów kalendarza." });
    }
  });

  // Record booking with collision validation
  app.post("/api/calendar/bookings", (req, res) => {
    try {
      const booking = req.body;
      const { treatmentName, durationMinutes, price, clientName, clientPhone, clientEmail, dateStr, timeStr, notes, isOnlineConsultation } = booking;

      if (!dateStr || !timeStr || !treatmentName) {
        return res.status(400).json({ error: "Brak wymaganych danych rezerwacji (data, godzina, zabieg)." });
      }

      const [year, month, day] = dateStr.split("-").map(Number);
      const reqDate = new Date(year, month - 1, day);
      const reqDay = reqDate.getDay();

      if (reqDay === 0 || reqDay === 6) {
        return res.status(400).json({ 
          error: "W weekendy (sobota i niedziela) gabinet jest nieczynny. Prosimy wybrać termin od poniedziałku do piątku w godzinach 10:00 — 19:30." 
        });
      }

      const duration = parseInt(durationMinutes, 10) || 75;
      const bufferMinutes = 15;
      const newStart = timeToMinutes(timeStr);
      const newEnd = newStart + duration + bufferMinutes;

      if (newStart < 10 * 60) {
        return res.status(400).json({ 
          error: "Gabinet rozpoczyna pracę od godziny 10:00 rano. Prosimy wybrać godzinę 10:00 lub późniejszą." 
        });
      }

      const allBookings = getStoredBookings();
      const dayBookings = allBookings.filter((b) => b.dateStr === dateStr);

      // Verify no collision
      const collision = dayBookings.find((b) => {
        const bStart = timeToMinutes(b.timeStr);
        const bEnd = bStart + (b.durationMinutes || 75) + bufferMinutes;
        return newStart < bEnd && newEnd > bStart;
      });

      if (collision) {
        return res.status(409).json({
          error: `Kolizja terminów! Wybrany przedział ${timeStr} koliduje z inną zaplanowaną wizytą (${collision.timeStr}). Prosimy wybrać inny wolny slot.`,
          collisionTime: collision.timeStr,
        });
      }

      const newBooking: StoredBooking = {
        id: `book-${Date.now()}`,
        treatmentName,
        durationMinutes: duration,
        price: price || "",
        clientName: clientName || "Klient",
        clientPhone: clientPhone || "",
        clientEmail: clientEmail || "",
        dateStr,
        timeStr,
        notes: notes || "",
        isOnlineConsultation: !!isOnlineConsultation,
        createdAt: new Date().toISOString(),
      };

      allBookings.push(newBooking);
      saveStoredBookings(allBookings);

      console.log(`[SLOW SKIN BOOKING] Synchronized reservation for: ${treatmentName} (${duration} min) on ${dateStr} ${timeStr} by ${clientName} (${clientPhone}, ${clientEmail}) -> Synced to slowskinconcept@gmail.com`);

      res.json({
        success: true,
        bookingId: newBooking.id,
        googleAccount: "slowskinconcept@gmail.com",
        calendarId: "ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com",
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Nie udało się zapisać rezerwacji" });
    }
  });

  // ==========================================
  // Newsletter Integration with slow-skin.shop
  // ==========================================
  const ALLOWED_NEWSLETTER_ORIGINS = [
    "https://slow-skin-concept.pl",
    "https://www.slow-skin-concept.pl",
    "https://slow-skin.shop",
    "https://www.slow-skin.shop"
  ];

  // In-memory rate limiting map: ip -> timestamps[] (5 requests per 10 minutes)
  const newsletterRateLimitMap = new Map<string, number[]>();

  app.options("/api/newsletter", (req, res) => {
    const origin = req.headers.origin || "";
    if (ALLOWED_NEWSLETTER_ORIGINS.includes(origin) || process.env.NODE_ENV !== "production") {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
    } else {
      res.setHeader("Access-Control-Allow-Origin", "https://slow-skin-concept.pl");
    }
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(204).end();
  });

  app.post("/api/newsletter", async (req, res) => {
    const origin = req.headers.origin || "";
    if (ALLOWED_NEWSLETTER_ORIGINS.includes(origin) || process.env.NODE_ENV !== "production") {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
    } else {
      res.setHeader("Access-Control-Allow-Origin", "https://slow-skin-concept.pl");
    }

    try {
      // 1. IP Rate Limiting (max 5 requests per 10 minutes per IP)
      const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
      const now = Date.now();
      const windowMs = 10 * 60 * 1000;
      const maxRequests = 5;

      const timestamps = (newsletterRateLimitMap.get(clientIp) || []).filter(t => now - t < windowMs);
      if (timestamps.length >= maxRequests) {
        newsletterRateLimitMap.set(clientIp, timestamps);
        return res.status(429).json({
          error: "TOO_MANY_REQUESTS",
          message: "Zbyt wiele prób zapisu z tego adresu IP. Odczekaj chwilę przed kolejną próbą."
        });
      }
      timestamps.push(now);
      newsletterRateLimitMap.set(clientIp, timestamps);

      // 2. Validate payload matching slow-skin.shop contract
      const { action, email, consent, version, website } = req.body || {};

      // Anti-bot honeypot check (field must be empty)
      if (website && typeof website === "string" && website.trim().length > 0) {
        console.warn(`[NEWSLETTER BOT BLOCKED] Honeypot triggered by ${clientIp}`);
        return res.status(200).json({
          success: true,
          message: "Jeśli adres wymaga potwierdzenia, wyślemy link. Sprawdź pocztę i spam. Link jest ważny 24 godziny."
        });
      }

      if (action !== "subscribe") {
        return res.status(400).json({
          error: "INVALID_ACTION",
          message: "Nieprawidłowa akcja (wymagane: 'subscribe')."
        });
      }

      if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({
          error: "INVALID_EMAIL",
          message: "Wprowadź prawidłowy adres e-mail."
        });
      }

      if (consent !== true) {
        return res.status(400).json({
          error: "CONSENT_REQUIRED",
          message: "Zgoda na otrzymywanie newslettera i akceptacja zasad jest wymagana."
        });
      }

      const cleanEmail = email.trim().toLowerCase();
      const payloadVersion = version || "newsletter-2026-10-02-v1";

      // 3. Forward to shop's central backend (slow-skin.shop)
      const shopNewsletterUrl = "https://slow-skin.shop/api/newsletter";
      
      const payload = {
        action: "subscribe",
        email: cleanEmail,
        consent: true,
        version: payloadVersion,
        website: ""
      };

      // Forward request with Origin of slow-skin-concept.pl
      const shopResponse = await fetch(shopNewsletterUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://slow-skin-concept.pl",
          "User-Agent": "SlowSkinConcept-Integration/1.0",
          "X-Forwarded-For": clientIp
        },
        body: JSON.stringify(payload)
      });

      const responseText = await shopResponse.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        responseJson = { raw: responseText };
      }

      if (shopResponse.ok) {
        // Success from shop backend!
        return res.status(200).json({
          success: true,
          message: responseJson.message || "Jeśli adres wymaga potwierdzenia, wyślemy link. Sprawdź pocztę i spam. Link jest ważny 24 godziny.",
          shopConfirmed: true
        });
      }

      // Check if shop rejected due to origin whitelist pending
      if (shopResponse.status === 403 || responseJson?.error === "INVALID_ORIGIN" || (responseJson?.error && typeof responseJson.error === "string" && responseJson.error.toLowerCase().includes("origin"))) {
        console.warn(`[NEWSLETTER SHOP INTEGRATION] slow-skin.shop returned ${shopResponse.status}. Whitelisting of https://slow-skin-concept.pl in shop backend is pending.`);
        return res.status(200).json({
          success: false,
          code: "ORIGIN_WHITELIST_PENDING",
          message: "Centralny system sklepu wymaga dodania domeny https://slow-skin-concept.pl do dozwolonych źródeł (CORS/Origin). Dokończ zapis jednym kliknięciem bezpośrednio w sklepie:",
          shopUrl: `https://slow-skin.shop/#newsletter?email=${encodeURIComponent(cleanEmail)}`,
          email: cleanEmail
        });
      }

      // Other error from shop
      return res.status(shopResponse.status).json({
        error: responseJson?.error || "SHOP_ERROR",
        message: responseJson?.message || "Nie udało się zrealizować zapisu w systemie sklepu.",
        shopUrl: `https://slow-skin.shop/#newsletter?email=${encodeURIComponent(cleanEmail)}`
      });

    } catch (err: any) {
      console.error("[NEWSLETTER PROXY ERROR]:", err);
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Wystąpił przejściowy błąd połączenia z serwerem newslettera. Skorzystaj z formularza w sklepie.",
        shopUrl: "https://slow-skin.shop/#newsletter"
      });
    }
  });

  // helper to clean markdown wrapping around JSON output
  function cleanJsonString(str: string): string {
    let clean = str.trim();
    if (clean.startsWith("```json")) {
      clean = clean.substring(7);
    } else if (clean.startsWith("```")) {
      clean = clean.substring(3);
    }
    if (clean.endsWith("```")) {
      clean = clean.substring(0, clean.length - 3);
    }
    return clean.trim();
  }

  // API Route: Expert Skincare Diagnosis powered by Gemini
  app.post("/api/diagnose", async (req, res) => {
    // Helper function to generate premium local clinical backup diagnosis based on answers
    const getFallbackDiagnosis = (answers: any) => {
      const isSensitive = answers.skinConcerns?.includes("Rumień") || answers.skinType?.includes("pieczeniem") || answers.treatmentHistory?.includes("silne peelingi");
      const isAgingOrContour = answers.skinConcerns?.includes("Wiotkość") || answers.ageGroup?.includes("46-60") || answers.ageGroup?.includes("ponad 60") || answers.expectations?.includes("lifting") || answers.expectations?.includes("starzenia");
      
      let skinTypeAssessment = "";
      let biologicalCauses = "";
      let morningRoutine: string[] = [];
      let eveningRoutine: string[] = [];
      let clinicalTherapies: { name: string; explanation: string }[] = [];
      let holisticMindfulness = "";

      if (isSensitive) {
        skinTypeAssessment = "Bionomiczne badanie cyfrowe ujawnia stan wzmożonego pobudzenia immuno-sensorycznego naskórka z naruszeniem szczelności cementu międzykomórkowego. Twoja skóra wykazuje silne mechanizmy obronne – płaszcz hydrolipidowy został drastycznie uszczuplony, najpewniej pod wpływem intensywnej pielęgnacji kwasowej lub przewlekłych czynników stresogennych podkradających wodę z głębokich warstw skóry właściwej.";
        biologicalCauses = "Głównym motorem odczuwanego ściągnięcia i rumienia jest neurogenna dekompensacja bariery naskórkowej wywołana chronicznym wyrzutem kortyzolu. Hormon ten blokuje naturalną syntezę kluczowych ceramidów oraz kwasów tłuszczowych. Dodatkowo uwalnianie neuropeptydów przez receptory czuciowe naskórka wywołuje nagłe, niekontrolowane rozszerzanie naczyń włosowatych i stan mikro-zapalny tkanki.";
        morningRoutine = [
          "Delikatne oczyszczenie bionomiczną emulsją bezolejową o ultra-łagodnym pH, bazującą wyłącznie na aminokwasach.",
          "Aplikacja esencji komórkowej z czystą ektoiną (3%) oraz prebiotykami w celu przywrócenia równowagi mikrobiomu.",
          "Zastosowanie biomimetycznego kremu ochronnego bogatego w ceramidy NP/AP/EOP oraz naturalny skwalan biomimetyczny.",
          "Nałożenie mineralnej, bezzapachowej fotoprotekcji SPF 50 o fizjologicznym wykończeniu."
        ];
        eveningRoutine = [
          "Pierwsze oczyszczenie: demakijaż i usuwanie smogu fizjologicznym hydrofilnym olejem z nasion ogórecznika.",
          "Drugie oczyszczenie: delikatna pianka aminokwasowa chroniąca fizjologiczną faunę naskórkową.",
          "Aplikacja serum regeneracyjno-wyciszającego z beta-glukanem oraz kwasem glicyryzynowym w celu uciszenia reaktywności.",
          "Okluzja: bogaty, regenerujący krem rekonstruujący z kwasem ulowym, cholesterolem i kwasem hialuronowym."
        ];
        clinicalTherapies = [
          {
            name: "Slow Neuro-Modeling (Lifting Manualny) & Wyciszenie",
            explanation: "Autorski masaż rozluźnia głębokie napięcia neuro-mięśniowe, redukując poziom wydzielanego lokalnie kortyzolu, podczas gdy bio-kompatybilne okłady przywracają fizjologiczną równowagę lipidów."
          },
          {
            name: "Biologiczna Terapia Ochronna S.O.S.",
            explanation: "Zabieg zogniskowany na natychmiastowym uszczelnieniu połączeń ścisłych i nasyczeniu naskórka bionomicznymi lipidami identycznymi z fizjologicznymi."
          }
        ];
        holisticMindfulness = "Przed snem wykonaj 3-minutowy bionomiczny oddech komórkowy: wdychaj powietrze przez 4 sekundy, zatrzymaj na 4, wydychaj przez 6. Skup się na cieple rozchodzącym się w tkankach twarzy, co wycisza nerw trójdzielny.";
      } else if (isAgingOrContour) {
        skinTypeAssessment = "Analiza strukturalna wskazuje na widoczne spowolnienie procesów podziałowych w warstwie rozrodczej naskórka oraz spadek syntezy kolagenu w fibroblastach. Ubytek naturalnych lipidów strukturalnych oraz spoiwa międzykomórkowego osłabia grawitacyjne rusztowanie skóry, w wyniku czego naskórek traci swoją pierwotną plastyczność i sprężystość komórkową.";
        biologicalCauses = "Zjawisko to jest silnie potęgowane przez mechanizm 'inflammaging' (przyspieszone starzenie tkanki stymulowane stanami mikrozapalnymi) oraz przewlekłą ekspozycję na promieniowanie monitorów (Blue Light) prowokującą degradację włókien sprężystych. Osłabione komórki skóry wolniej reagują na mechanizmy autonaprawcze, co pogłębia zmarszczki mimiczne oraz wiotkość.";
        morningRoutine = [
          "Mycie twarzy odżywczą, lipidową emulsją z kompleksem regeneracyjnym i antyoksydantami z zielonej herbaty.",
          "Aplikacja zaawansowanego serum z neuropeptydami modelującymi oraz komórkami macierzystymi z wąkrotki azjatyckiej.",
          "Zastosowanie kremu epigenetycznego na bazie biomimetyków stymulującego ujędrnienie skóry.",
          "Aksamitny filtr ochronny SPF 50 o działaniu anti-blue-light przeciwdziałający fotostarzeniu komórek."
        ];
        eveningRoutine = [
          "Dokładny demakijaż i mycie fizjologicznym mleczkiem z kompleksem witaminowym.",
          "Aplikacja aktywnego serum z bezpodrażnieniowym retinaldehydem (0.05%) połączonym z niacynamidem dla restrukturyzacji nocnej.",
          "Bogaty lipidowy krem rekonstruujący komórki z peptydami miedziowymi i fitosterolami rzepakowymi."
        ];
        clinicalTherapies = [
          {
            name: "Epigenetyczny Rytuał Slow Aging",
            explanation: "Spektakularne nasycenie tkanek składnikami aktywnymi hamującymi starzenie na poziomie ekspresji genów komórkowych, połączone z drenażem biomolekularnym."
          },
          {
            name: "Slow Neuro-Modeling (Autorski Lifting Manualny)",
            explanation: "Głęboki masaż tkanek głębokich i powięzi twarzy uwalnia zastałe napięcia mimiczne, przywracając młodzieńczą wolumetrię i stymulując mikrokrążenie."
          }
        ];
        holisticMindfulness = "Zastosuj masaż liftingujący chłodnymi kulami kriogenicznymi lub różowym kwarcem. Wykonuj ruchy wyłącznie w górę i na zewnątrz, synchronizując je z powolnym, głębomim oddechem przeponowym.";
      } else {
        // Default / Dehydrated / Stressed Skin
        skinTypeAssessment = "Ocena bionomiczna wskazuje na odwodnienie głębokiej macierzy zewnątrzkomórkowej przy jednoczesnym nadmiernym nagromadzeniu zrogowaciałych korneocytów na powierzchni skóry. Prowadzi to do matowego odcienia skóry, drobnej sieci zmarszczek dehydratacyjnych i chwilowego braku naturalnej elastyczności.";
        biologicalCauses = "Nasilenie transepidermalnej utraty wody (TEWL) wynika ze spadku syntezy naturalnego czynnika nawilżającego (NMF). Towarzyszący temu stres środowiskowy (smog, klimatyzacja) blokuje enzymy odpowiedzialne za fizjologiczne złuszczanie naskórka, przez co staje się on szorstki w dotyku i trudniej absorbuje substancje odżywcze.";
        morningRoutine = [
          "Oczyszczanie łagodną emulsją z niskocząsteczkowym kwasem hialuronowym i ekologiczną aloesą.",
          "Tonizacja delikatną esencją bogatą w aminokwasy oraz minerały oceaniczne przywracające prawidłowe pH.",
          "Aplikacja serum rewitalizującego z kwasem bursztynowym (2%) oraz ektoiną dla zasilenia metabolizmu mitochondrialnego.",
          "Zabezpieczenie skóry kremem stabilizującym nawilżenie na bazie trehalozy i fosfolipidów."
        ];
        eveningRoutine = [
          "Dwuetapowe oczyszczanie: olej rycynowy i szafranowy, a następnie ultradelikatna pianka probiotyczna.",
          "Wyjątkowa komórkowa maska nocna z kwasem laktobionowym, glukonolaktonem i ekstraktami z borówki naturalnej.",
          "Odżywczy balsam regeneracyjny z kwasami tłuszczowymi Omega-3 i Omega-6 budujący pełną spójność naskórkową."
        ];
        clinicalTherapies = [
          {
            name: "Slow Skin Concept™ — Pierwsza Wizyta z Diagnozą",
            explanation: "Kompleksowa sesja biokompatybilnej hydratacji oraz precyzyjne ustalenie aktualnego profilu sensorycznego Twojej skóry."
          },
          {
            name: "Regeneracja Kwasem Bursztynowym i Ektoiną",
            explanation: "Dogłębna rewitalizacja metaboliczna komórek naskórka, która momentalnie rozświetla i ujednolica strukturę komórkową tkanki."
          }
        ];
        holisticMindfulness = "Zanurz dłonie w ciepłej wodzie z dodatkiem olejku lawendowego przed wieczorną rutyną. Poczuj ten moment w pełni, uciszając myśli i koncentrując się na zapachu, co obniża poziom wydzielanego kortyzolu.";
      }

      return {
        skinTypeAssessment,
        biologicalCauses,
        atHomePrescription: {
          morning: morningRoutine,
          evening: eveningRoutine
        },
        clinicalTherapies,
        holisticMindfulness
      };
    };

    try {
      const { answers } = req.body;
      if (!answers) {
        return res.status(400).json({ error: "Brak danych diagnostycznych." });
      }

      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        console.warn("GEMINI_API_KEY is missing. Generating high-quality local fallback diagnosis.");
        return res.json(getFallbackDiagnosis(answers));
      }

      try {
        const client = getGeminiClient();

        const systemInstruction = `Jesteś elitarnym dermatologiem estetycznym, diagnostą skóry i ekspertem kosmetycznym instytutu 'Slow Skin Concept' w Jelczu-Laskowicach. 
Twój styl komunikacji to "Quiet Luxury": wyrafinowany, wyciszający, mądry, poetycki lecz głęboko naukowy i oparty na fizjologii oraz neurobiologii, pełen empatii i profesjonalizmu (editorial, luksusowy gabinet, biologiczna terapia skóry).
Mówisz w języku polskim. Twoim zadaniem jest przeanalizowanie kwestionariusza skóry klientki i stworzenie autorskiej diagnozy oraz holistycznej terapii opartej na gotowości biologicznej i neuroplastyczności skóry.
Nigdy nie używaj szablonowych sformułowań ani nie wspominaj o masowych markach kosmetycznych, skup się na fizjologicznych składnikach aktywnych (np. ektoina, prebiotyki, skwalan, ceramidy, retinaldehyd, kwas bursztynowy) i odporności naskórka.`;

        const promptMsg = `Wykonaj precyzyjną analizę skóry na podstawie następujących informacji z kwestionariusza:
- Wiek klientki / kategoria wiekowa: ${answers.ageGroup || "Niezdefiniowano"}
- Główne wyzwania i troski skóry: ${answers.skinConcerns || "Niezdefiniowano"}
- Typ skóry w ocenie klientki: ${answers.skinType || "Niezdefiniowano"}
- Poziom codziennego stresu: ${answers.stressLevel || "Niezdefiniowano"}
- Dieta i styl życia: ${answers.lifestyle || "Niezdefiniowano"}
- Dotychczasowa pielęgnacja i zabiegi gabinetowe: ${answers.treatmentHistory || "Niezdefiniowano"}
- Oczekiwania wobec terapii: ${answers.expectations || "Niezdefiniowano"}

Stwórz ekskluzywny raport diagnostyczny, który uświadomi klientce biologiczną przyczynę jej problemów, uspokoi ją i przedstawi autorski plan regeneracji skóry.`;

        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptMsg,
          config: {
            systemInstruction,
            temperature: 0.7,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                skinTypeAssessment: {
                  type: Type.STRING,
                  description: "Ekspercka, głęboka i pełna szacunku ocena aktualnego stanu skóry i jej bariery naskórkowej. (około 4-5 zdań, ton luksusowego magazynu)"
                },
                biologicalCauses: {
                  type: Type.STRING,
                  description: "Naukowe wyjaśnienie biologicznych i neuro-kosmetycznych przyczyn zgłaszanych problemów (np. wpływ kortyzolu na kolagen, uszkodzenie płaszcza hydrolipidowego). (około 4-5 zdań)"
                },
                atHomePrescription: {
                  type: Type.OBJECT,
                  properties: {
                    morning: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Poranny rytuał - lista kroków z precyzyjnym wyjaśnieniem zastosowania składników aktywnych"
                    },
                    evening: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Wieczorny rytuał - lista kroków o charakterze restrukturyzującym i odżywczym"
                    }
                  },
                  required: ["morning", "evening"]
                },
                clinicalTherapies: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Nazwa luksusowego zabiegu (np. Biologiczna Terapia Regeneracyjna, Slow Neuro-Modeling lub Epigenetyczny Slow Aging)" },
                      explanation: { type: Type.STRING, description: "Ekspercka argumentacja dlaczego akurat ten rytuał gabinetowy jest kluczowy dla jej skóry" }
                    },
                    required: ["name", "explanation"]
                  },
                  description: "Zalecane terapie gabinetowe w menu Slow Skin Concept (wybierz 1-2 dedykowane zabiegi z oferty)"
                },
                holisticMindfulness: {
                  type: Type.STRING,
                  description: "Piękny, poetycki i relaksujący rytuał mindfulness dla skóry i zmysłów (np. technika oddychania komórkowego, wieczorny masaż jadeitowy, higiena snu w neuro-pielęgnacji)."
                }
              },
              required: [
                "skinTypeAssessment",
                "biologicalCauses",
                "atHomePrescription",
                "clinicalTherapies",
                "holisticMindfulness"
              ]
            }
          }
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error("Brak odpowiedzi od silnika diagnozy AI.");
        }

        const cleanedText = cleanJsonString(responseText);
        const diagnosisData = JSON.parse(cleanedText);
        return res.json(diagnosisData);
      } catch (geminiError: any) {
        console.error("Gemini API direct call failed, falling back to expert local diagnostic generator:", geminiError);
        return res.json(getFallbackDiagnosis(req.body.answers || []));
      }
    } catch (error: any) {
      console.error("Diagnostic endpoint error:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas generowania diagnozy." });
    }
  });

  const getLocalAssistantResponse = (chatHistory: any[]) => {
      const normalizePolish = (str: string) => {
        return str
          .toLowerCase()
          .replace(/[ąàáâãäå]/g, "a")
          .replace(/[ćç]/g, "c")
          .replace(/[ęèéêë]/g, "e")
          .replace(/[ł]/g, "l")
          .replace(/[ńñ]/g, "n")
          .replace(/[óòôõöø]/g, "o")
          .replace(/[ś]/g, "s")
          .replace(/[źż]/g, "z");
      };

      const lastMsg = chatHistory[chatHistory.length - 1];
      const lastUserMsg = lastMsg && lastMsg.role === "user" ? lastMsg.content : "";
      const msg = normalizePolish(lastUserMsg || "").trim();

      // --- DETECT INTENT / QUESTION TYPE ---
      const isPain = msg.includes("boli") || msg.includes("bol") || msg.includes("piecz") || 
                     msg.includes("nieprzyjemn") || msg.includes("komfort") || msg.includes("agresywn") || 
                     msg.includes("znieczul") || msg.includes("strach") || msg.includes("delikatn") || 
                     msg.includes("nakluw") || msg.includes("inwazyj");

      const isPrice = msg.includes("cen") || msg.includes("koszt") || msg.includes("platn") || 
                      msg.includes("ile") || msg.includes("pln") || msg.includes("drogo") || 
                      msg.includes("tanio") || msg.includes("budzet") || msg.includes("cennik");

      const isContra = msg.includes("przeciwwskaz") || msg.includes("bezpiecz") || msg.includes("ciaz") || 
                       msg.includes("laktac") || msg.includes("karmi") || msg.includes("skutki") || 
                       msg.includes("uboczn") || msg.includes("powiklan") || msg.includes("uczul") ||
                       msg.includes("alerg") || msg.includes("bezpieczen");

      const isEffects = msg.includes("efekt") || msg.includes("rezultat") || msg.includes("co daje") || 
                        msg.includes("wskazan") || msg.includes("pomo") || msg.includes("dla kogo") || 
                        msg.includes("komu") || msg.includes("warto") || msg.includes("dzialanie") ||
                        msg.includes("rezultaty");

      const isProcess = msg.includes("jak wyglada") || msg.includes("przebieg") || msg.includes("procedur") || 
                        msg.includes("przygotow") || msg.includes("po zabieg") || msg.includes("odstep") || 
                        msg.includes("ile razy") || msg.includes("seri") || msg.includes("czesto") ||
                        msg.includes("etap");

      const isBooking = msg.includes("rezerw") || msg.includes("umow") || msg.includes("termin") || 
                        msg.includes("woln") || msg.includes("zapis") || msg.includes("kontakt") ||
                        msg.includes("telefon");

      // --- DETECT SUBJECT IN CURRENT TURN ---
      let resolvedSubject: string | null = null;

      const checkSubject = (text: string): string | null => {
        const t = normalizePolish(text || "");
        if (t.includes("nogier") || t.includes("neurolift") || t.includes("fale")) {
          return "nogier";
        }
        if (t.includes("hifu") || t.includes("ultradzwiek")) {
          return "hifu";
        }
        if (t.includes("rf") || t.includes("mikroigl") || t.includes("radiofrek") || t.includes("termolift")) {
          return "rf";
        }
        if (t.includes("bursztyn") || t.includes("amber")) {
          return "bursztyn";
        }
        if (t.includes("kwas") || t.includes("peeling") || t.includes("zluszcz") || t.includes("eksfoli")) {
          return "acids";
        }
        if (t.includes("biolog") || t.includes("ektoin") || t.includes("ceram")) {
          return "biologiczna";
        }
        if (t.includes("epigen") || t.includes("retro") || t.includes("remodel") || t.includes("telomer")) {
          return "epigenetyczny";
        }
        if (t.includes("pierwsza") || t.includes("konsult") || t.includes("nati") || t.includes("diagnos") || (t.includes("wizyt") && !t.includes("kazda"))) {
          return "first_visit";
        }
        if (t.includes("rak") || t.includes("dloni") || t.includes("dlon")) {
          return "hands";
        }
        if (t.includes("adres") || t.includes("gdzie") || t.includes("lokalizac") || t.includes("jelcz") || t.includes("laskowic") || t.includes("ulic") || t.includes("szkoln") || t.includes("dojazd")) {
          return "address";
        }
        if (t.includes("katarzyn") || t.includes("brzezinsk") || t.includes("kosmetolog") || t.includes("zalozyciel") || t.includes("ekspert")) {
          return "katarzyna";
        }
        if (t.includes("metod") || t.includes("autorsk") || t.includes("filozof") || t.includes("bionom") || t.includes("concept")) {
          return "philosophy";
        }
        if (t.includes("rumien") || t.includes("naczyn") || t.includes("wrazli") || t.includes("zaczerw") || t.includes("rozowat") || t.includes("podraz") || t.includes("reakt")) {
          return "redness";
        }
        if (t.includes("such") || t.includes("odwodn") || t.includes("luszcz") || t.includes("sciag") || t.includes("woda") || t.includes("nawilz")) {
          return "dry";
        }
        if (t.includes("tradz") || t.includes("por") || t.includes("zaskor") || t.includes("wyprysk") || t.includes("krost") || t.includes("lojot") || t.includes("tlust")) {
          return "acne";
        }
        if (t.includes("zmarszcz") || t.includes("wiotk") || t.includes("jedrn") || t.includes("starze") || t.includes("bruzdy") || t.includes("aging") || t.includes("lifting") || t.includes("owis")) {
          return "aging";
        }
        if (t.includes("przebarw") || t.includes("plam") || t.includes("koloryt") || t.includes("melasm") || t.includes("slonecz")) {
          return "discoloration";
        }
        if (t.includes("ocz") || t.includes("cienie") || t.includes("worki") || t.includes("zmecz") || t.includes("opuch")) {
          return "eyes";
        }
        if (t.includes("blizn") || t.includes("rozstep") || t.includes("slady")) {
          return "scars";
        }
        return null;
      };

      resolvedSubject = checkSubject(lastUserMsg);

      // --- CONTEXTUAL INHERITANCE ---
      let inheritedFromContext = false;
      if (!resolvedSubject) {
        for (let i = chatHistory.length - 2; i >= 0; i--) {
          const pastMsg = chatHistory[i];
          if (pastMsg && pastMsg.role === "user") {
            const pastSub = checkSubject(pastMsg.content);
            if (pastSub) {
              resolvedSubject = pastSub;
              inheritedFromContext = true;
              break;
            }
          }
        }
      }

      // --- GENERATE RESPONSE ---

      // 1. NEUROLIFTING (Fale Nogiera)
      if (resolvedSubject === "nogier") {
        if (isPain) {
          return `**Czy seans Neurolifting — Fale Nogiera boli?**\n\n` +
                 `Absolutnie nie! Jest to jeden z najbardziej kojących i głęboko relaksujących rytuałów w Instytucie Slow Skin Concept™.\n\n` +
                 `Wykorzystujemy precyzyjne mikroczęstotliwości elektromagnetyczne dr. Paula Nogiera połączone z delikatną stymulacją i terapią światłem LED. Zabieg ten nie wywołuje żadnego dyskomfortu, nie nakłuwa skóry i nie uszkadza jej mechanicznie. Wręcz przeciwnie — wycisza układ nerwowy i ucisza neuro-wrażliwość skóry do tego stopnia, że nasi goście często zapadają w regenerujący sen.\n\n` +
                 `Czy chciałbyś [wyświetlić kartę Neuroliftingu](treatment:neurolifting-nogier) lub [zarezerwować ten luksusowy, bezbolesny rytuał](book:neurolifting-nogier)?`;
        }
        if (isPrice) {
          return `**Ile kosztuje seans Neurolifting — Fale Nogiera?**\n\n` +
                 `Rytuał ten (czas trwania: 90 minut) kosztuje **500 PLN**.\n\n` +
                 `Cena ta obejmuje pełną procedurę regeneracyjną: demakijaż bionomiczny, stymulację mikroczęstotliwościami elektromagnetycznymi dr Nogiera, leczniczą chromoterapię LED oraz masaż neuro-wyciszający z bionomowym eliksirem lipidowym.\n\n` +
                 `Czy chcesz bezpośrednio [wybrać dogodny termin rezerwacji](book:neurolifting-nogier) czy dowiedzieć się więcej o [jego fizjologicznych efektach](treatment:neurolifting-nogier)?`;
        }
        if (isContra) {
          return `**Przeciwwskazania do seansu Neurolifting — Fale Nogiera:**\n\n` +
                 `Ponieważ seans opiera się na ultra-bezinwazyjnych mikroprądach biomimetycznych, jest nadzwyczaj bezpieczny. Jednak ze względów medycznych wykluczeniami są:\n` +
                 `* Aktywny rozrusznik serca lub metalowe implanty w miejscu seansu\n` +
                 `* Aktywna padaczka (epilepsja)\n` +
                 `* Ciąża\n\n` +
                 `Jeśli te kryteria Cię nie dotyczą, zabieg jest w 100% bezpieczny i wysoce wskazany dla wyciszenia nadreaktywności.\n\n` +
                 `Czy chciałbyś [rozpocząć rezerwację online](book:neurolifting-nogier)?`;
        }
        if (isEffects || isProcess) {
          return `**Jakie efekty daje Neurolifting i jak przebiega ten seans?**\n\n` +
                 `Neuro-regulacja komórkowa dr. Paula Nogiera to przełom w walce z przewlekłym zapaleniem naskórka i skutkami stresu:\n` +
                 `* **Wyciszenie naczyń krwionośnych:** Natychmiast kurczy rozszerzone naczynka i likwiduje rumień.\n` +
                 `* **Uciszenie stresu komórkowego:** Przywraca homeostazę skórze neuro-wrażliwej i zmęczonej.\n` +
                 `* **Naturalny lifting:** Rozluźnia zmarszczki mimiczne napięciowe i podnosi owal twarzy.\n\n` +
                 `Seans trwa 90 minut, jest niezwykle odprężający i bionomiczny.\n\n` +
                 `Możesz przeczytać [szczegóły o Neuroliftingu](treatment:neurolifting-nogier) lub [dokonać rezerwacji online](book:neurolifting-nogier).`;
        }
        return `**Neurolifting — Fale Nogiera** (500 PLN, 90 min) to unikalna neuro-regulacja komórkowa naskórka opracowana przez kosmetolog Katarzynę Brzezińską.\n\n` +
               `Wykorzystując mikroczęstotliwości dr. Paula Nogiera oraz chromoterapię LED, wygaszamy nadaktywność układu nerwowego skóry, co likwiduje rumień i przynosi absolutne wyciszenie napięć stresowych oraz naturalne wygładzenie zmarszczek mimicznych.\n\n` +
               `${inheritedFromContext ? `*(Nawiązuję w ten sposób do Twojego pytania o Neurolifting)*\n\n` : ""}` +
               `Czy chciałbyś wiedzieć czy [rytuał wywołuje ból](query:boli), poznać [szczegółowy opis zabiegu](treatment:neurolifting-nogier) czy bezpośrednio [zarezerwować wizytę online](book:neurolifting-nogier)?`;
      }

      // 2. HIFU (Lifting Ultradźwiękowy)
      if (resolvedSubject === "hifu") {
        if (isPain) {
          return `**Czy zabieg HIFU — Lifting Ultradźwiękowy boli?**\n\n` +
                 `Zabieg HIFU w Instytucie Slow Skin Concept™ jest procedurą dobrze tolerowaną i całkowicie nieinwazyjną dla naskórka.\n\n` +
                 `Podczas emisji zogniskowanej fali ultradźwiękowej na wrażliwszych obszarach (np. linia żuchwy) możesz odczuwać głębokie rozgrzanie tkanki, delikatne mrowienie lub punktowe ukłucie. **Zabieg nie wymaga znieczulenia** i nie pozostawia żadnych śladów na twarzy – bezpośrednio po wyjściu z gabinetu wracasz do swoich codziennych zajęć.\n\n` +
                 `Możesz poznać [całkowitą procedurę HIFU](treatment:hifu-lifting) lub [zarezerwować pojedynczy seans roczny](book:hifu-lifting).`;
        }
        if (isPrice) {
          return `**Jaka jest cena zabiegu HIFU?**\n\n` +
                 `Cena zabiegu wynosi **600 PLN — 800 PLN** w zależności od obszaru zabiegowego i dobranej ilości impulsów.\n\n` +
                 `Należy pamiętać, że HIFU to rzadka terapia – spektakularny efekt uniesienia owalu uzyskuje się zazwyczaj po **jednej sesji**, którą powtarza się dopiero po 12-18 miesiącach. Czyni to tę technologię niezwykle oszczędną w czasie i kosztach.\n\n` +
                 `Zapisz się: [Lifting HIFU w kalendarzu online](book:hifu-lifting) lub przeczytaj [pełny opis zabiegu](treatment:hifu-lifting).`;
        }
        if (isContra) {
          return `**Przeciwwskazania do zabiegu HIFU — Lifting Ultradźwiękowy:**\n\n` +
                 `Mimo bezinwazyjności dla naskórka, głęboka penetracja fali akustycznej wyklucza zabieg w przypadku:\n` +
                 `* Ciąża oraz okres karmienia piersią\n` +
                 `* Rozrusznika serca i metalowych implantów w miejscu zabiegowym\n` +
                 `* Chorób nowotworowych\n` +
                 `* Świeżo podanego botoksu lub kwasu hialuronowego w miejscu zabiegu (odczekaj minimum 4 tygodnie, ponieważ ultradźwięki przyspieszają ich degradację)\n\n` +
                 `Czy chcesz dowiedzieć się więcej o [wymogu odstępów po innych zabiegach](treatment:hifu-lifting)?`;
        }
        if (isEffects || isProcess) {
          return `**Jakie efekty uzyskasz dzięki technologii HIFU?**\n\n` +
                 `To naturalny, bezkrwawy lifting działający na warstwę SMAS (powięź mięśniowo-rozcięgnową) na głębokości 4.5 mm:\n` +
                 `* Natychmiastowe obkurczenie zwiotczałych struktur kolagenowych pod wpływem bodźca termicznego.\n` +
                 `* Wyraźne podniesienie opadającego owalu twarzy, wyostrzenie linii żuchwy (tzw. "chomików") oraz zniwelowanie drugiego podbródka.\n` +
                 `* Bezpieczne zagęszczenie i ujędrnienie wiotkiej skóry szyi i dekoltu.\n\n` +
                 `Pełen efekt przebudowy rozwija się do 90 dni i utrzymuje się do 1,5 roku.\n\n` +
                 `Wyświetl [detale technologii HIFU](treatment:hifu-lifting) lub [dokonaj rezerwacji VIP](book:hifu-lifting).`;
        }
        return `**HIFU — Lifting Ultradźwiękowy bez Skalpela** (600 - 800 PLN) to najskuteczniejsza nieinwazyjna metoda odbudowy głębokich włókien podporowych skóry (warstwa SMAS, 4.5mm) w Slow Skin Concept™.\n\n` +
               `Dzięki precyzyjnej fali ultradźwiękowej natychmiastowo zagęszczamy wiotką skórę, podnosimy opadające kąciki ust oraz przywracamy naturalny kontur linii żuchwy, eliminując potrzebę inwazyjnych operacji plastycznych.\n\n` +
               `${inheritedFromContext ? `*(Nawiązuję w ten sposób do Twojego pytania o HIFU)*\n\n` : ""}` +
               `Czy chciałbyś wiedzieć czy [HIFU boli](query:boli), poznać [przeciwwskazania](query:przeciwwskazania) czy bezpośrednio [zapisać się na lifting](book:hifu-lifting)?`;
      }

      // 3. RADIOFREKWENCJA MIKROIGŁOWA (RF)
      if (resolvedSubject === "rf") {
        if (isPain) {
          return `**Czy zabieg Radiofrekwencji Mikroigłowej boli?**\n\n` +
                 `Radiofrekwencja Mikroigłowa łączy mechaniczne nakłuwanie naskórka z jednoczesnym podgrzaniem tkanki falą radiową. Ponieważ zależy nam na Twoim pełnym komforcie, **przed przystąpieniem do procedury znieczulamy skórę łagodzącym kremem**.\n\n` +
                 `Dzięki temu zabieg jest całkowicie komfortowy, a odczucia zredukowane są do łagodnego nacisku i ciepła. Po seansie skóra może być przez kilka godzin zaróżowiona, ale bionomowe serum lipidowe szybko przywraca jej pełen komfort.\n\n` +
                 `Sprawdź [szczegółowy opis RF Mikroigłowej](treatment:rf-microneedling) or [zamów wizytę w kalendarzu](book:rf-microneedling).`;
        }
        if (isPrice) {
          return `**Ile kosztuje Radiofrekwencja Mikroigłowa (Termolifting)?**\n\n` +
                 `Cena zabiegu wynosi **500 PLN — 700 PLN** w zależności od obszaru zabiegowego (np. twarz, twarz + szyja).\n\n` +
                 `Zabieg wywołuje intensywną, głęboką przebudowę mechaniczną i termiczną komórek skóry, skutecznie likwidując wiotkość i rozszerzone pory.\n\n` +
                 `Możesz [zarezerwować ten rytuał regeneracji](book:rf-microneedling) lub zobaczyć [pełny opis technologii](treatment:rf-microneedling).`;
        }
        if (isContra) {
          return `**Przeciwwskazania do Radiofrekwencji Mikroigłowej:**\n\n` +
                 `Z uwagi na nakłuwanie tkanki oraz przepływ prądu o częstotliwości radiowej, wykluczeniami są:\n` +
                 `* Ciąża oraz okres karmienia piersią\n` +
                 `* Metalowe implanty w obszarze zabiegowym lub rozrusznik serca\n` +
                 `* Skłonność do powstawania bliznowców (keloidów)\n` +
                 `* Aktywne stany zapalne skóry (opryszczka, ropne wykwity trądzikowe)\n` +
                 `* Choroby nowotworowe i autoimmunologiczne w ostrej fazie\n\n` +
                 `Czy chcesz [skonsultować bezpieczeństwo zabiegu](treatment:slow-skin-first) na Pierwszej Wizycie?`;
        }
        if (isEffects || isProcess) {
          return `**Jakie efekty daje Radiofrekwencja Mikroigłowa i na czym polega?**\n\n` +
                 `Zabieg stymuluje gwałtowny skurcz rozciągniętych włókien kolagenowych oraz budowę nowego bionomicznego rusztowania białkowego skóry:\n` +
                 `* **Niesamowite zwężenie porów** oraz wygładzenie struktury naskórka.\n` +
                 `* **Likwidacja wiotkości:** Gwałtowny wzrost gęstości i napięcia skóry.\n` +
                 `* **Spłycenie zmarszczek** oraz blizn potrądzikowych.\n\n` +
                 `Seria zabiegowa składa się zwykle z 2-3 seansów co 4-6 tygodni.\n\n` +
                 `Poznaj [szczegóły procedury RF](treatment:rf-microneedling) lub [dokonaj rezerwacji terminu online](book:rf-microneedling).`;
        }
        return `**Radiofrekwencja Mikroigłowa (Kliniczny Termolifting)** (500 - 700 PLN) w Slow Skin Concept™ to bezkompromisowa fuzja mikronakłuwania z falą radiową.\n\n` +
               `Seans drastycznie zagęszcza wiotką strukturę naskórka, kurczy rozszerzone pory, spłyca zmarszczki i blizny potrądzikowe bez naruszania bionomicznej harmonii tkankowej.\n\n` +
               `${inheritedFromContext ? `*(Nawiązuję w ten sposób do Twojego pytania o Radiofrekwencję)*\n\n` : ""}` +
               `Czy chciałbyś wiedzieć czy [zabieg RF boli](query:boli), poznać [ceny](query:cena) czy bezpośrednio [zarezerwować swój termin](book:rf-microneedling)?`;
      }

      // 4. REGENERACJA KWASEM BURSZTYNOWYM
      if (resolvedSubject === "bursztyn") {
        if (isPain) {
          return `**Czy Regeneracja Kwasem Bursztynowym boli?**\n\n` +
                 `Absolutnie nie! To seans całkowicie bezbolesny, przyjemny i wysoce fizjologiczny.\n\n` +
                 `Kwas bursztynowy w naszej autorskiej pielęgnacji bionomicznej nie służy do agresywnego, kwasowego złuszczania naskórka (którego unikamy, by nie wywoływać przewlekłych zapaleń). Jest on wprowadzany jako biostymulator tlenowy bezpośrednio w głąb komórki. Nie wywołuje pieczenia ani późniejszego łuszczenia skóry po seansie – bezpośrednio po wyjściu z gabinetu Twoja cera charakteryzuje się niesamowitym blaskiem.\n\n` +
                 `Wypróbuj ten komfortowy rytuał: [dokonaj rezerwacji online](book:amber-regeneration) lub dowiedz się o nim więcej [tutaj](treatment:amber-regeneration).`;
        }
        if (isPrice) {
          return `**Jaka jest cena Regeneracji Kwasem Bursztynowym?**\n\n` +
                 `Cena autorskiego rytuału wynosi **450 PLN**.\n\n` +
                 `Seans ten to doskonałe uderzenie dotleniające, które przywraca komórkom naskórka życiową energię ATP poprzez stymulację mitochondrialną.\n\n` +
                 `Możesz natychmiast zarezerwować dogodny czas: [Terapia Bursztynowa online](book:amber-regeneration) lub wyświetlić [jej pełną specyfikację](treatment:amber-regeneration).`;
        }
        if (isEffects || isProcess) {
          return `**Fizjologiczne efekty i wskazania do Terapii Kwasem Bursztynowym:**\n\n` +
                 `Ten pięciowymiarowy rytuał to ratunek dla komórek pozbawionych tlenu i blasku:\n` +
                 `* **Mitochondrialny reset:** Pobudza oddychanie komórkowe i syntezę energii ATP.\n` +
                 `* **Niesamowit blask:** Likwiduje szarość, ziemistość i zmęczenie cery.\n` +
                 `* **Przeciwstarzeniowo:** Spłyca zmarszczki napięciowe.\n` +
                 `* **Wyciszenie zapaleń:** Bezpiecznie łagodzi stany zapalne bez wywoływania łuszczenia.\n\n` +
                 `Możesz sprawdzić opisy [Regeneracji Kwasem Bursztynowym](treatment:amber-regeneration) lub [zamówić ten seans online](book:amber-regeneration).`;
        }
        return `**Regeneracja Kwasem Bursztynowym** (450 PLN) to autorski pięciowymiarowy rytuał biomimetycznej odnowy komórkowej w naszym Instytucie.\n\n` +
               `Kwas bursztynowy bezpośrednio pobudza oddychanie komórkowe wewnątrz mitochondriów, błyskawicznie gasząc szarość, zmęczenie oraz zmarszczki napięciowe bez jakiegokolwiek podrażnienia czy złuszczania.\n\n` +
               `${inheritedFromContext ? `*(Nawiązuję w ten sposób do Twojego pytania o Kwas Bursztynowy)*\n\n` : ""}` +
               `Czy chciałbyś wiedzieć czy [rytuał wywołuje ból](query:boli) czy chciałbyś [zarezerwować ten zabieg](book:amber-regeneration)?`;
      }

      // 5. BIOLOGICZNA TERAPIA REGENERACYJNA
      if (resolvedSubject === "biologiczna") {
        if (isPain) {
          return `**Czy Biologiczna Terapia Regeneracyjna boli?**\n\n` +
                 `Absolutnie nie! To niezwykle przyjemny, otulający i kojący seans bionomiczny.\n\n` +
                 `Jej jedynym celem jest natychmiastowe ugaszenie ostrego stanu zapalnego, pieczenia i zlikwidowanie nadwrażliwości. Procedura opiera się na dostarczeniu naskórkowi biozgodnego cementu komórkowego (ceramidów, cholesterolu i kwasów tłuszczowych) oraz farmaceutycznej ektoiny w atmosferze głębokiego relaksu manualnego. Poczujesz natychmiastową ulgę i usunięcie pieczenia.\n\n` +
                 `Podaruj swojej skórze chwilę bionomicznego ukojenia: [Zarezerwuj Terapię Biologiczną](book:biological-therapy).`;
        }
        if (isEffects || isPrice || isProcess) {
          return `**Biologiczna Terapia Regeneracyjna** (480 PLN) to ratunek dla skóry z uszkodzonym płaszczem lipidowym:\n` +
                 `* Rekonstruuje uszkodzoną barierę hydrolipidową za pomocą lipidów zgodnych w 100% ze spoiwem międzykomórkowym naskórka.\n` +
                 `* Likwiduje szorstkość, uczucie ściągnięcia, pieczenia oraz rumień.\n` +
                 `* Wspomaga leczenie trądziku różowatego i nadreaktywności naczyniowej.\n\n` +
                 `Idealne bionomiczne wsparcie np. po zmianach klimatycznych lub błędach pielęgnacyjnych.\n\n` +
                 `Czy chcesz [zobaczyć szczegóły Terapii Biologicznej](treatment:biological-therapy) czy [zarezerwować wizytę](book:biological-therapy)?`;
        }
        return `**Biologiczna Terapia Regeneracyjna** (480 PLN) to absolutna korona odbudowy płaszcza hydrolipidowego w naszym Instytucie.\n\n` +
               `Dostarczając czystych bionomicznie ceramidów, wolnego cholesterolu oraz ektoiny lekarskiej, odbudowujemy spójność cementu komórkowego, usuwając szorstkość, nadwrażliwość i rumień.\n\n` +
               `${inheritedFromContext ? `*(Nawiązuję w ten sposób do Twojego pytania o Terapię Biologiczną)*\n\n` : ""}` +
               `Czy pragniesz dowiedzieć się czy [rytuał wywołuje ból](query:boli) czy chcesz [zarezerwować go online](book:biological-therapy)?`;
      }

      // 6. EPIGENETYCZNY SLOW AGING
      if (resolvedSubject === "epigenetyczny") {
        return `**Epigenetyczny Slow Aging (Meso Remodeling)** (550 PLN) to zaawansowane nanotechnologiczne uderzenie w strukturę telomerów komórkowych:\n\n` +
               `* Wykorzystuje bionomiczny retinaldehyd oraz czysty kwas bursztynowy do stymulacji kolagenu typu I oraz III bez wywoływania odczynu zapalnego (*inflammaging*).\n` +
               `* Reguluje ekspresję genów odpowiedzialnych za przedwczesne starzenie i chroni przed degeneracją posłoneczną (elastoza).\n` +
               `* Zabieg jest całkowicie **bezbolesny, bezpieczny** i wykazuje natychmiastowe działanie ujędrniające.\n\n` +
               `Czy chcesz [dowiedzieć się więcej o EPIGENETYCE](treatment:epigenetic-aging) czy [zarezerwować swój bezpieczny rytuał](book:epigenetic-aging)?`;
      }

      // 7. SPECIAL PART: HANDS / PALMS IRRITATION (suchość dłoni, skórę rąk)
      if (resolvedSubject === "hands") {
        return `**Podrażnienie, suchość i pękanie skóry rąk oraz dłoni**\n\n` +
               `Skóra dłoni posiada niezwykle cienki płaszcz hydrolipidowy i jest stale wystawiona na działanie czynników agresywnych (detergenty, mróz, wiatr, twarda woda). Aby trwale przywrócić jej homeostazę, należy zastosować fizjologiczne uszczelnienie lipidowe:\n\n` +
               `1. **Ratunek bionomiczny gabinetowy:** Doskonłym ukojeniem dla zniszczonych dłoni jest nasza **Biologiczna Terapia Regeneracyjna** (480 PLN) stosowana na suche partie ciała. Dostarcza ona identycznych z naskórkiem lipidów, cholesterolu oraz ektoiny lekarskiej, które natychmiast uzupełniają ubytki w barierze ochronnej dłoni, likwidując swędzenie i pękanie.\n` +
               `2. **Pielęgnacja domowa:** Unikaj mydeł z SCS/SLS, noś rękawiczki i aplikuj kremy w 100% bionomiczne (bez syntetycznych zapachów, które na uszkodzonej skórze wywołują silny alergiczny odczyn zapalny).\n\n` +
               `Najlepszym punktem wyjścia jest nasza komputerowa diagnostyka barierowa natężenia TEWL na urządzeniu Nati V3: [Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first).\n\n` +
               `Czy chciałbyś dowiedzieć się więcej o [Terapii Biologicznej](treatment:biological-therapy) czy [rozpocząć rezerwację Pierwszej Wizyty](book:slow-skin-first)?`;
      }

      // 8. FIRST VISIT / GENERAL PROCESS
      if (resolvedSubject === "first_visit") {
        if (isPrice) {
          return `**Cena i pakiety Pierwszej Wizyty Diagnostycznej:**\n\n` +
                 `W zależności od pożądanego zakresu oferujemy dwa pakiety wprowadzające:\n` +
                 `* **Pakiet Standard (400 PLN, 90 min):** Obejmuje holistyczny wywiad, fizjologiczną ocenę barierowości, ułożenie Beauty Planu oraz zabieg wprowadzający bionomiczny.\n` +
                 `* **Pakiet Premium (600 PLN, 120 min):** Obejmuje wywiad, **zaawansowane komputerowe badanie barierowości naskórka aparatem Nati V3 i Iomet** (pomiar TEWL, naczynek, poziomu sebum, głębokości zmarszczek), ułożenie pełnego Beauty Planu oraz rytuał otwierający dobrany do potrzeb skóry.\n\n` +
                 `Zarezerwuj tę dogłębną diagnostykę: [Pierwsza Wizyta online](book:slow-skin-first).`;
        }
        return `**Slow Skin Concept™ — Pierwsza Wizyta** (400 - 600 PLN, 120 min) to nasza fundamentalna konsultacja wprowadzająca, od której Katarzyna Brzezińska zawsze rekomenduje rozpoczęcie terapii bionomicznej:\n\n` +
               `1. **Rzetelny wywiad holistyczny:** Analizujemy zdrowie Twojego organizmu, styl życia i kosmetyki domowe.\n2. **Komputerowa diagnostyka Nati V3:** Bezinwazyjnie badamy parametry skóry (ucieczka wody TEWL, stopień rumienia, sebum, zmarszczki).\n3. **Zabieg bionomiczny otwierający:** Dobieramy i wykonujemy od razu spersonalizowany rytuał, który koi nadreaktywność skóry.\n4. **Beauty Plan:** Otrzymujesz na piśmie spersonalizowaną ścieżkę pielęgnacji domowej.\n\n` +
               `Zapraszam do zapoznania się ze [szczegółami Pierwszej Wizyty](treatment:slow-skin-first) lub [zarezerwowania terminu VIP w kalendarzu](book:slow-skin-first).`;
      }

      // 9. ADDRESS / LOCATION
      if (resolvedSubject === "address") {
        return `Nasz kameralny, bionomiczny salon mieści się pod adresem:\n\n` +
               `**Instytut Slow Skin Concept™**\n` +
               `**ul. Szkolna 5, Jelcz-Laskowice**\n` +
               `(wygodny dojazd z Wrocławia, Oławy, Brzegu i całego Dolnego Śląska; bezpośrednio przed wejściem czekają na Państwa dedykowane, komfortowe, bezpłatne miejsca parkingowe VIP dla naszych gości).\n\n` +
               `Po zarezerwowaniu seansu intencyjnego, nasz zespół kontaktuje się z Tobą telefonicznie, aby ułatwić dojazd i zapewnić pełną opiekę od momentu przybycia.\n\n` +
               `Czy pragniesz [dokonać rezerwacji Pierwszej Wizyty](book:slow-skin-first) czy chcesz poznać nasz [cennik](treatment:slow-skin-first)?`;
      }

      // 10. KATARZYNA BRZEZIŃSKA
      if (resolvedSubject === "katarzyna") {
        return `Opiekę dermatologiczno-bionomiczną w Slow Skin Concept™ sprawuje osobiście **Katarzyna Brzezińska** — wybitna kosmetolog, założycielka Instytutu i prekursorka bionomicznej odbudowy komórkowej.\n\n` +
               `Katarzyna odrzuca agresywną stymulację skóry i niepotrzebny ból naskórka na rzecz głębokiej fizjologicznej harmonii. Każdy rytuał w jej rękach to unikalne dzieło sztuki komórkowej, zindywidualizowane pod kątem parametrów zbadanych systemem Nati V3.\n\n` +
               `Zapraszamy do zarezerwowania spotkania zapoznawczego bezpośrednio w jej kalendarzu: [Slow Skin Concept™ — Pierwsza Wizyta](book:slow-skin-first) (400 - 600 PLN).`;
      }

      // 11. PHILOSOPHY / AUTORSKA METODA
      if (resolvedSubject === "philosophy") {
        return `**Autorska metoda bionomicznej odbudowy komórkowej Slow Skin Concept™** opracowana przez kosmetolog Katarzynę Brzezińską to fizjologiczna rewolucja w pielęgnacji cery.\n\n` +
               `W naszej filozofii rezygnujemy całkowicie z inwazyjnych, drażniących naskórek złuszczań kwasowych czy stymulacji laserowej, które niszczą płaszcz hydrolipidowy i wywołują stały stan zapalny (*inflammaging*). Skupiamy się na trzech filarach:\n\n` +
               `1. **Bionomicznej zgodności (100%):** Używamy czystych kosmetyków wolnych od parabenów, silikonów, konserwantów i zapachów. Ich struktura naśladuje naturalne spoiwo międzykomórkowe naskórka.\n` +
               `2. **Neuro-Regulacji (Fale dr. Paula Nogiera):** Wyciszamy receptory stresu skóry za pomocą precyzyjnych częstotliwości elektromagnetycznych w bezinwazyjnym rytuale [Neuroliftingu](treatment:neurolifting-nogier).\n` +
               `3. **Komputerowej diagnostyce:** Każdy ruch terapeutyczny popieramy pomiarami barierowymi Nati V3 podczas [Pierwszej Wizyty](treatment:slow-skin-first).\n\n` +
               `Czy chciałbyś [umówić się na seans bionomiczny](book:slow-skin-first)?`;
      }

      // 12. GENERAL SKIN CONCERNS (ONLY IF NO SPECIFIC SUBJECT DIRECTLY RETRIEVED FROM MESSAGE)
      if (resolvedSubject === "redness") {
        return `**Walka z rumieniem, naczynkami i nadwrażliwością skóry** w Instytucie Slow Skin Concept™ opiera się na wyciszeniu receptorów czuciowych i biologicznej odbudowie płaszcza hydrolipidowego.\n\n` +
               `W naszej autorskiej filozofii bionomicznej rezygnujemy z agresywnej, kwasowej lub laserowej stymulacji, która wywołuje przewlekły odczyn zapalny (*inflammaging*). Zamiast tego oferujemy seanse o najwyższym stopniu biozgodności:\n\n` +
               `1. [Biologiczna Terapia Regeneracyjna](treatment:biological-therapy) (480 PLN) — to unikalny bionomiczny seans odbudowujący cement komórkowy. Dostarcza biozgodnych lipidów, wolnego cholesterolu oraz farmaceutycznej ektoiny. Perfekcyjnie wygasza pieczenie, ściągnięcie, zaczerwienienie i wspomaga leczenie trądziku różowatego.\n\n` +
               `2. [Neurolifting — Fale Nogiera](treatment:neurolifting-nogier) (500 PLN) — neuro-regulacja komórkowa naskórka z wykorzystaniem mikroczęstotliwości elektromagnetycznych dr. Paula Nogiera. Wygasza grę naczyniową i łagodzi nadreaktywność skóry wywołaną stresem.\n\n` +
               `Gorąco zalecam rozpoczęcie od naszej dwugodzinnej konsultacji: [Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first), podczas której za pomocą komputerowego badania Nati V3 rzetelnie ocenimy stan naczyń włosowatych oraz barierowość naskórka.\n\n` +
               `Czy chciałbyś zapisać się na [Pierwszą Wizytę Diagnostyczną](book:slow-skin-first) czy dowiedzieć się więcej o [Terapii Biologicznej](treatment:biological-therapy)?`;
      }

      if (resolvedSubject === "dry") {
        return `**Głęboka suchość, odwodnienie i łuszczenie się skóry** potrzebują czegoś więcej niż tylko wody — wymagają fizjologicznego uszczelnienia barierowego.\n\n` +
               `W Instytucie Slow Skin Concept™ podchodzimy do skóry suchej z komórkowym szacunkiem:\n\n` +
               `* [Biologiczna Terapia Regeneracyjna](treatment:biological-therapy) (480 PLN) — rekonstruuje uszkodzony mur lipidowy naskórka, natychmiastowo eliminując uczucie ściągnięcia, pieczenia i szorstkości.\n` +
               `* [Regeneracja Kwasem Bursztynowym](treatment:amber-regeneration) (450 PLN) — piatowymiarowa odnowa komórkowa z mezoterapią mikroigłową, która głęboko nawadnia tkankę za pomocą N-acetyloglukozaminy i kwasu lipidowego Omega-3.\n\n` +
               `Idealnym i niezbędnym punktem wyjścia jest nasza komputerowa diagnostyka barierowa: [Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first) (Pakiet Premium za 600 PLN), która zmierzy wskaźnik TEWL (ucieczkę wody z naskórka) i pozwoli ułożyć perfekcyjny Beauty Plan.\n\n` +
               `Czy chciałbyś zarezerwować [Pierwszą Wizytę Diagnostyczną online](book:slow-skin-first)?`;
      }

      if (resolvedSubject === "acne") {
        return `**Terapia skóry trądzikowej, tłustej i borykającej się z zaskórnikami** w naszym Instytucie opiera się na regulacji pracy gruczołów łojowych i wyciszaniu stanów zapalnych, bez silnego przesuszania czy podrażniania.\n\n` +
               `Zamiast agresywnych kuracji złuszczających, które mogą uszkodzić naskórek, polecamy:\n\n` +
               `* [Regeneracja Kwasem Bursztynowym](treatment:amber-regeneration) (450 PLN) — kwas bursztynowy to naturalna biostymulacja tlenowa, która działa przeciwzapalnie i regulująco. Oczyszcza pory i przywraca komórkom energię ATP.\n` +
               `* [Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first) — kluczowa diagnostyka komputerowa, dzięki której zbadamy poziom sebum oraz stopień nawilżenia, eliminując błędy pielęgnacyjne, które często nasilają łojotok.\n\n` +
               `Możesz przeczytać więcej o [Pierwszej Wizycie](treatment:slow-skin-first) i [dokonać rezerwacji online](book:slow-skin-first).`;
      }

      if (resolvedSubject === "acids") {
        return `**Zabiegi z kwasami i peelingi złuszczające w Slow Skin Concept™**\n\n` +
               `Zgodnie z naszą autorską filozofią bionomicznej odbudowy komórkowej opracowaną przez kosmetolog Katarzynę Brzezińską, w naszym Instytucie **całkowicie rezygnujemy z agresywnych, kwasowych złuszczeń naskórka** oraz tradycyjnych silnych peelingów chemicznych.\n\n` +
               `Tradycyjne seanse z mocnymi kwasami niszczą naturalną barierę hydrolipidową skóry, prowadząc do jej przewlekłego uwrażliwienia, odwodnienia i nasilenia stanów zapalnych (*inflammaging*). Zamiast tego skupiamy się na fizjologicznym wspieraniu barierowości i odbudowy komórkowej.\n\n` +
               `Jeśli zależy Ci na spektakularnym blasku, odnowie, redukcji zmarszczek lub leczeniu niedoskonałości, oferujemy niezwykle skuteczne, bezbolesne, bionomiczne alternatywy:\n\n` +
               `* **[Regeneracja Kwasem Bursztynowym](treatment:amber-regeneration)** (450 PLN) — to nasz flagowy seans. Kwas bursztynowy nie służy u nas do agresywnego złuszczania, lecz działa jako biologiczny stymulator tlenowy bezpośrednio w mitochondriach komórkowych. Błyskawicznie redukuje zmarszczki napięciowe, przywraca skórze niesamowity blask i energię ATP bez jakiegokolwiek podrażnienia.\n` +
               `* **[Epigenetyczny Slow Aging (Meso Remodeling)](treatment:epigenetic-aging)** (550 PLN) — łączy bionomiczny retinaldehyd oraz czysty kwas bursztynowy w celu inteligentnej przebudowy i ochrony telomerów komórkowych, również bez odczynu zapalnego czy uciążliwego łuszczenia skóry.\n\n` +
               `Każdą terapię zawsze dobieramy na podstawie parametrów barierowości zbadanych podczas konsultacji. Najlepiej zacząć od: **[Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first)** (400 - 600 PLN).\n\n` +
               `Czy chciałbyś [zarezerwować Terapie Bursztynową online](book:amber-regeneration) czy zapisać się na [Pierwszą Wizytę Diagnostyczną](book:slow-skin-first)?`;
      }

      if (resolvedSubject === "aging") {
        return `**Utrata jędrności, zmarszczki i wiotkość skóry (Terapia Slow-Aging i Lifting)**\n\n` +
               `W naszym Instytucie do procesu starzenia skóry podchodzimy z głębokim szacunkiem komórkowym — odrzucamy agresywne stymulatory niszczące barierę hydrolipidową. Proponujemy ultra-skuteczne, bezpieczne rozwiązania bionomiczne oraz zaawansowaną technologię bezrekonwalescencyjną:\n\n` +
               `* **[HIFU — Lifting Ultradźwiękowy](treatment:hifu-lifting)** (600 PLN — 800 PLN) — bezinwazyjne, głębokie liftingowanie na poziomie powięzi mięśniowej SMAS. Wykorzystuje skoncentrowaną falę ultradźwiękową do spektakularnego zagęszczenia wiotkiej skóry i uniesienia owalu twarzy.\n` +
               `* **[Radiofrekwencja Mikroigłowa (Termolifting)](treatment:rf-microneedling)** (500 PLN — 700 PLN) — remodeluje i skraca włókna kolagenowe za pomocą prądu RF i precyzyjnych mikroigieł. Genialna metoda na głębokie bruzdy i wiotkość.\n` +
               `* **[Epigenetyczny Slow Aging (Meso Remodeling)](treatment:epigenetic-aging)** (550 PLN) — nanotechnologiczna stymulacja kolagenu typu I oraz III z retinaldehydem i kwasem bursztynowym. Hamuje procesy starzenia bez odczynu zapalnego (*inflammaging*).\n` +
               `* **[Regeneracja Kwasem Bursztynowym](treatment:amber-regeneration)** (450 PLN) — stymulacja mitochondriów komórkowych dająca zastrzyk energii ATP i redukująca zmarszczki napięciowe.\n\n` +
               `Najlepszym punktem wyjścia jest nasza komputerowa ocena barierowości oraz głębokości zmarszczek za pomocą systemu Nati V3 podczas **[Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first)**.\n\n` +
               `Czy chciałbyś [zarezerwować Pierwszą Wizytę online](book:slow-skin-first) czy dowiedzieć się więcej o [Liftingu HIFU](treatment:hifu-lifting)?`;
      }

      if (resolvedSubject === "discoloration") {
        return `**Terapia przebarwień, plam posłonecznych i nierównego kolorytu (Melasma)**\n\n` +
               `Skuteczna redukcja przebarwień w Slow Skin Concept™ opiera się na regulowaniu procesu melanogenezy i ochronie komórek przed stresem oksydacyjnym, a nie na agresywnym złuszczaniu kwasami, które uszkadza barierę skórną i często nasila problem:\n\n` +
               `* **[Epigenetyczny Slow Aging (Meso Remodeling)](treatment:epigenetic-aging)** (550 PLN) — bionomiczny retinaldehyd reguluje pracę melanocytów i delikatnie rozpędza odnowę naskórka, co pozwala na bezpieczne i stabilne rozjaśnienie plam bez efektów ubocznych.\n` +
               `* **[Regeneracja Kwasem Bursztynowym](treatment:amber-regeneration)** (450 PLN) — kwas bursztynowy ma silne właściwości antyoksydacyjne, przyspiesza regenerację komórkową naskórka i wspaniale wyrównuje koloryt oraz rozświetla szarą i zmęczoną skórę.\n\n` +
               `Zapraszamy na naszą komputerową diagnostykę: **[Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first)** (400 - 600 PLN). Zbadamy głębokość melaniny pod aparatem Nati V3, co pozwoli nam ułożyć idealny i w 100% spersonalizowany Beauty Plan.\n\n` +
               `Czy chciałbyś [umówić się na Pierwszą Wizytę online](book:slow-skin-first)?`;
      }

      if (resolvedSubject === "eyes") {
        return `**Cienie pod oczami, zmęczone spojrzenie, wiotkość i obrzęki**\n\n` +
               `Skóra wokół oczu jest najcieńsza na całej twarzy i niemal pozbawiona gruczołów łojowych, dlatego najszybciej zdradza oznaki zmęczenia i starzenia. Proponujemy niezwykle delikatne, neuro-fizjologiczne zabiegi napinające i drenujące:\n\n` +
               `* **[Neurolifting — Fale Nogiera](treatment:neurolifting-nogier)** (500 PLN) — stymulacja mikroczęstotliwościami dr. Nogiera fantastycznie drenuje limfę, uelastycznia naczynia krwionośne, zmniejszając cienie i likwidując opuchliznę wokół oczu.\n` +
               `* **[Regeneracja Kwasem Bursztynowym](treatment:amber-regeneration)** (450 PLN) — kwas bursztynowy naturalnie rozjaśnia delikatną okolicę oka, stymuluje komórki skóry do intensywnej regeneracji, wygładzając drobne zmarszczki (tzw. kurze łapki).\n` +
               `* **[Biologiczna Terapia Regeneracyjna](treatment:biological-therapy)** (480 PLN) — głęboko nawilża i odbudowuje barierę lipidową w okolicach oczu, likwidując przesuszony wygląd i uczucie ściągnięcia.\n\n` +
               `Zapraszamy na: **[Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first)**, gdzie precyzyjnie sprawdzimy stopień nawilżenia i barierowości naskórka wokół oczu.\n\n` +
               `Czy chciałbyś [zarezerwować Neurolifting online](book:neurolifting-nogier)?`;
      }

      if (resolvedSubject === "scars") {
        return `**Redukcja blizn, śladów potrądzikowych oraz wiotkości tkanki**\n\n` +
               `Blizny oraz głębokie ślady potrądzikowe lub rozstępy wymagają intensywnej, ale w pełni kontrolowanej rekonstrukcji głębokich warstw skóry:\n\n` +
               `* **[Radiofrekwencja Mikroigłowa (Termolifting)](treatment:rf-microneedling)** (500 PLN — 700 PLN) — to absolutnie bezkonkurencyjny rytuał w walce z bliznami. Poprzez mechaniczne mikronakłuwanie z jednoczesną emisją fali radiowej stymulujemy kurczenie się starego kolagenu i wyzwalamy silne procesy neokolagenezy, które pięknie wyrównują strukturę skóry.\n` +
               `* **[Regeneracja Kwasem Bursztynowym](treatment:amber-regeneration)** (450 PLN) — kwas bursztynowy jako stymulator tkankowy tlenowy drastycznie przyspiesza procesy regeneracji komórkowej, rewitalizuje blizny od wewnątrz i uelastycznia tkankę łączną.\n\n` +
               `Zalecamy rozpoczęcie od konsultacji: **[Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first)**, aby kosmetolog Katarzyna Brzezińska mogła ocenić głębokość i wiek zmian oraz dopasować optymalną serię zabiegów.\n\n` +
               `Czy chciałbyś [wybrać termin na Pierwszą Wizytę](book:slow-skin-first) czy dowiedzieć się więcej o [Radiofrekwencji](treatment:rf-microneedling)?`;
      }

      // 13. BOOKING INQUIRY (without specific treatment)
      if (isBooking) {
        return `Wizyta w Slow Skin Concept™ ma status VIP i rozpoczyna się od bezpiecznej intencji rezerwacji przez naszą witrynę.\n\n` +
               `Po przesłaniu intencji, Katarzyna Brzezińska lub asystentka Instytutu podejmie kontakt telefoniczny na Twój numer w ciągu najbliższych 2 godzin klinicznych w celu zsynchronizowania komfortowej pory wizyty.\n\n` +
               `Najlepiej zacząć od naszej fundamentalnej konsultacji: [Rozpocznij Rezerwację Pierwszej Wizyty](book:slow-skin-first) lub zadzwonić bezpośrednio pod numer **+48 71 318 12 34**.`;
      }

            // 14. PRICE INQUIRY (without specific treatment)
      if (isPrice) {
        return `Nasze gabinetowe terapie komórkowe cechują się podejściem bionomicznym quiet luxury i są w pełni warte swojej obietnicy:\n\n` +
               `* **Slow Skin Pierwsza Wizyta Premium (Konsultacja + Badania + Zabieg):** 600 PLN\n` +
               `* **Regeneracja Kwasem Bursztynowym:** 450 PLN\n` +
               `* **Neurolifting — Fale Nogiera:** 500 PLN\n` +
               `* **Biologiczna Terapia Regeneracyjna:** 480 PLN\n` +
               `* **Epigenetyczny Slow Aging (Meso Remodeling):** 550 PLN\n` +
               `* **HIFU — Lifting Ultradźwiękowy:** 600 PLN — 800 PLN\n` +
               `* **Radiofrekwencja Mikroigłowa (Termolifting):** 500 PLN — 700 PLN\n\n` +
               `Możesz [wyświetlić całe menu i cennik w zakładce Gabinet](treatment:slow-skin-first).`;
      }

      // 15. DEFAULT DIALOGUE CHAT HISTORY DEPTH FALLBACK
      if (chatHistory.length > 2) {
        return `Rozumiem Twoje pytania i cenię troskę o właściwą pielęgnację. W Instytucie Slow Skin Concept™ zależy nam na dostarczeniu rzetelnej, bezstresowej wiedzy fizjologicznej.\n\n` +
               `Czy zechcesz, abym przybliżyła szczegóły dotyczące któregoś z poniższych aspektów?\n\n` +
               `* **Zabiegi i Cennik:** Nasze flagowe seanse (np. [Terapia Bursztynowa](treatment:amber-regeneration), [HIFU](treatment:hifu-lifting), [Fale Nogiera](treatment:neurolifting-nogier))\n` +
               `* **Filozofia Bionomiczna:** Dlaczego unikamy agresywnej i kwasowej penetracji, a wspieramy barierowość?\n` +
               `* **Komputerowa Diagnostyka:** Jak zaawansowane komputerowe badanie Nati V3 pozwala nam ułożyć Twój osobisty Beauty Plan podczas [Pierwszej Wizyty](treatment:slow-skin-first).\n\n` +
               `Najbardziej zindywidualizowaną odpowiedź uzyskasz zawsze podczas bezpośredniego kontaktu z kosmetolog Katarzyną Brzezińską pod numerem **+48 71 318 12 34**.`;
      }

      return `Dzień dobry. Jestem Wirtualnym Konsjerżem Instytutu Slow Skin Concept™ w Jelczu-Laskowicach.\n\n` +
             `Chętnie udzielę Ci rzetelnych, fizjologicznych informacji o zabiegach, cenach oraz naszej autorskiej filozofii bionomicznej odbudowy komórkowej opracowanej przez kosmetolog Katarzyną Brzezińską.\n\n` +
             `**O co możesz zapytać?\n` +
             `* *Zabiegi i Ceny (np. HIFU, Radiofrekwencja, Terapia Bursztynowa)*\n` +
             `* *Medyczne zapytania, np.: jak walczyć z rumieniem, suchością czy zmarszczkami*\n` +
             `* *Wskazania i przeciwwskazania konkretnych rytuałów*\n` +
             `* *Jak wygląda pierwsza wizyta diagnostyczna z badaniem Nati V3*\n` +
             `* *Jak umówić konsultację lub zarezerwować termin*\n\n` +
             `Najlepszym punktem wyjścia jest zawsze nasza dwugodzinna [Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first) z komputerową oceną barierowości naskórka. W czym mogę pomóc Twojej skórze dzisiaj?`;
    };

    app.get("/api/settings/openai", (req, res) => {
      const key = getOpenaiApiKey();
      return res.json({ key });
    });

    app.post("/api/settings/openai", (req, res) => {
      const { key } = req.body;
      if (typeof key === "string") {
        const trimmed = key.trim();
        if (trimmed) {
          saveOpenaiApiKey(trimmed);
        } else {
          deleteOpenaiApiKey();
        }
        return res.json({ success: true, key: trimmed });
      }
      return res.status(400).json({ error: "Invalid key format" });
    });

    app.post("/api/assistant", async (req, res) => {
      try {
        const { messages, location } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Brak historii wiadomości." });
      }

      // 1. Check if OpenAI API Key is provided by client in headers, stored on server filesystem, or stored on server environment
      const openaiApiKey = ((req.headers["x-openai-api-key"] as string) || "").trim() || getOpenaiApiKey();
      
      if (openaiApiKey) {
        console.log("Using OpenAI API Key for Virtual Concierge (AI Concierge)...");
        try {
          const openai = new OpenAI({ apiKey: openaiApiKey });
          
          const systemInstruction = `Jesteś elitarnym Wirtualnym Konsjerżem (Asystentem AI) i ekspertem marki kliniki bionomicznej i komórkowej "Slow Skin Concept" w Jelczu-Laskowicach.
Twój styl asystowania odzwierciedla "Quiet Luxury" — jesteś niezwykle taktowny, ujmujący, posługujesz się wyrafinowanym, poetyckim, a zarazem dogłębnie fizjologicznym i naukowym językiem. Unikaj powszechnego, bezosobowego slangu ChatGPT, szablonów lub masowych rekomendacji kosmetycznych. Twoim celem jest edukowanie klientów, odpowiadanie na pytania o zabiegi, wskazania, przeciwwskazania, ceny oraz bezproblemowe ułatwianie rezerwacji.

Odpowiadaj WYŁĄCZNIE w oparciu o poniższy, rzetelny podkład wiedzy i cennik instytutu. Jeśli klient pyta o kwestie fizjologiczne, biologiczne lub zabiegowe nieujęte bezpośrednio w bazie wiedzy, odpowiedz mądrze i dyplomatycznie z odniesieniem do fizjologii, aczkolwiek zalecając pierwszą wizytę z komputerową diagnostyką.

---
${getKnowledgeBaseTextContext()}
---

ZASADY SFORCOWANIA LINKÓW I INTERAKCJI:
W swoich wypowiedziach ZAWSZE wpleć w treść markdown specjalne odsyłacze akcji (Action Links), kiedy wymieniasz dany zabieg lub polecasz rezerwację. Klienci mogą kliknąć ten link bezpośrednio w czacie, co natychmiast wywoła interakcję w aplikacji (otwarcie karty zabiegu lub okna rezerwacji).
Używaj DOKŁADNIE i ŚCIŚLE następujących szablonów linków:
- Wyświetlenie szczegółów zabiegu: [Dowolny naturalny tekst](treatment:id_zabiegu). Dostępne ID zabiegów: slow-skin-first, amber-regeneration, hifu-lifting, rf-microneedling, neurolifting-nogier, biological-therapy, epigenetic-aging. (np. [Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first))
- Bezpośrednie otwarcie rezerwacji: [Dowolny naturalny tekst](book:id_zabiegu). (np. [Złóż intencję rezerwacji na ten zabieg](book:amber-regeneration))
- Przeczytanie artykułu blogowego: [Dowolny naturalny tekst](article:id_artykułu). Dostępne ID artykułów: art-slow-skin-philosophy, art-neurobiology-skin, art-hydrolipid-barrier. (np. [Przeczytaj artykuł o barierze hydrolipidowej](article:art-hydrolipid-barrier))

Nigdy nie zmyślaj innych identyfikatorów ani nie dopisuj linków zewnętrznych. Pamiętaj, aby zawsze pisać profesjonalnie, z czułością dla dobra skóry, uciszając stres neuro-wrażliwości u klienta.`;

          const responseStream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemInstruction },
              ...messages.map(msg => ({
                role: msg.role === "assistant" ? "assistant" as const : "user" as const,
                content: msg.content
              }))
            ],
            stream: true,
            temperature: 0.7
          });

          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.setHeader("Transfer-Encoding", "chunked");

          for await (const chunk of responseStream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              res.write(text);
            }
          }
          return res.end();
        } catch (openaiError: any) {
          console.error("OpenAI API call failed, falling back to Gemini:", openaiError);
        }
      }

      // Extract the last user message
      const lastUserMsg = messages[messages.length - 1].content || "";

      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        console.warn("GEMINI_API_KEY is missing. Generating high-quality local offline response.");
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getLocalAssistantResponse(messages));
        return res.end();
      }

      try {
        const client = getGeminiClient();

        const systemInstruction = `Jesteś elitarnym Wirtualnym Konsjerżem (Asystentem AI) i ekspertem marki kliniki bionomicznej i komórkowej "Slow Skin Concept" w Jelczu-Laskowicach.
Twój styl asystowania odzwierciedla "Quiet Luxury" — jesteś niezwykle taktowny, ujmujący, posługujesz się wyrafinowanym, poetyckim, a zarazem dogłębnie fizjologicznym i naukowym językiem. Unikaj powszechnego, bezosobowego slangu ChatGPT, szablonów lub masowych rekomendacji kosmetycznych. Twoim celem jest edukowanie klientów, odpowiadanie na pytania o zabiegi, wskazania, przeciwwskazania, ceny oraz bezproblemowe ułatwianie rezerwacji.

Odpowiadaj WYŁĄCZNIE w oparciu o poniższy, rzetelny podkład wiedzy i cennik instytutu. Jeśli klient pyta o kwestie fizjologiczne, biologiczne lub zabiegowe nieujęte bezpośrednio w bazie wiedzy, odpowiedz mądrze i dyplomatycznie z odniesieniem do fizjologii, aczkolwiek zalecając pierwszą wizytę z komputerową diagnostyką.

---
${getKnowledgeBaseTextContext()}
---

ZASADY SFORCOWANIA LINKÓW I INTERAKCJI:
W swoich wypowiedziach ZAWSZE wpleć w treść markdown specjalne odsyłacze akcji (Action Links), kiedy wymieniasz dany zabieg lub polecasz rezerwację. Klienci mogą kliknąć ten link bezpośrednio w czacie, co natychmiast wywoła interakcję w aplikacji (otwarcie karty zabiegu lub okna rezerwacji).
Używaj DOKŁADNIE i ŚCIŚLE następujących szablonów linków:
- Wyświetlenie szczegółów zabiegu: [Dowolny naturalny tekst](treatment:id_zabiegu). Dostępne ID zabiegów: slow-skin-first, amber-regeneration, hifu-lifting, rf-microneedling, neurolifting-nogier, biological-therapy, epigenetic-aging. (np. [Slow Skin Concept™ — Pierwsza Wizyta](treatment:slow-skin-first))
- Bezpośrednie otwarcie rezerwacji: [Dowolny naturalny tekst](book:id_zabiegu). (np. [Złóż intencję rezerwacji na ten zabieg](book:amber-regeneration))
- Przeczytanie artykułu blogowego: [Dowolny naturalny tekst](article:id_artykułu). Dostępne ID artykułów: art-slow-skin-philosophy, art-neurobiology-skin, art-hydrolipid-barrier. (np. [Przeczytaj artykuł o barierze hydrolipidowej](article:art-hydrolipid-barrier))

Nigdy nie zmyślaj innych identyfikatorów ani nie dopisuj linków zewnętrznych. Pamiętaj, aby zawsze pisać profesjonalnie, z czułością dla dobra skóry, uciszając stres neuro-wrażliwości u klienta.`;

        // Map client messages format {role, content} to Gemini SDK format
        // client roles: 'user' / 'assistant'. Map to SDK roles: 'user' / 'model'
        const sdkContents = messages.map(msg => ({
          role: msg.role === "assistant" ? "model" as const : "user" as const,
          parts: [{ text: msg.content }]
        }));

        const config: any = {
          systemInstruction,
          temperature: 0.7,
          tools: [{ googleMaps: {} }]
        };

        if (location && typeof location.latitude === "number" && typeof location.longitude === "number") {
          config.toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: location.latitude,
                longitude: location.longitude
              }
            }
          };
        }

        const responseStream = await client.models.generateContentStream({
          model: "gemini-3.5-flash",
          contents: sdkContents,
          config
        });

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");

        const mapLinks: { uri: string; title: string }[] = [];
        const seenUris = new Set<string>();

        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            res.write(text);
          }

          // Try to extract grounding metadata from this chunk
          const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
          if (chunks && Array.isArray(chunks)) {
            for (const c of chunks) {
              const mapsUri = c.web?.uri || c.maps?.uri;
              const title = c.web?.title || c.maps?.title || "Zobacz na mapie";
              if (mapsUri && !seenUris.has(mapsUri)) {
                seenUris.add(mapsUri);
                mapLinks.push({ uri: mapsUri, title });
              }

              // Also check deep inside maps place answer sources
              const sources = c.maps?.placeAnswerSources;
              if (sources && Array.isArray(sources)) {
                for (const src of sources) {
                  if (src.uri && !seenUris.has(src.uri)) {
                    seenUris.add(src.uri);
                    mapLinks.push({ uri: src.uri, title: src.title || "Źródło" });
                  }
                  if (src.reviewSnippets && Array.isArray(src.reviewSnippets)) {
                    for (const rev of src.reviewSnippets) {
                      if (rev.uri && !seenUris.has(rev.uri)) {
                        seenUris.add(rev.uri);
                        mapLinks.push({ uri: rev.uri, title: rev.title || "Opinia o miejscu" });
                      }
                    }
                  }
                }
              }
            }
          }
        }

        // List grounding links at the end of response if any exist
        if (mapLinks.length > 0) {
          res.write("\n\n**Miejsca i źródła z map Google:**\n");
          for (const link of mapLinks) {
            res.write(`- [${link.title}](${link.uri})\n`);
          }
        }

        res.end();
      } catch (geminiError: any) {
        console.error("Gemini API call failed in assistant endpoint:", geminiError);
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.write(getLocalAssistantResponse(messages));
        return res.end();
      }
    } catch (error: any) {
      console.error("Assistant endpoint error:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas komunikacji z asystentem." });
    }
  });

  // Serve static assets directly from public in both dev and production
  const publicDirStatic = path.join(process.cwd(), "public");
  if (fs.existsSync(publicDirStatic)) {
    app.use(express.static(publicDirStatic));
  }

  // Explicit route for uploaded root images (.png, .jpg, .webp) from public or dist
  app.get("/:imageFile(*.(png|jpg|jpeg|webp|svg))", (req, res, next) => {
    const filename = req.params.imageFile;
    const pubFile = path.join(process.cwd(), "public", filename);
    const distFile = path.join(process.cwd(), "dist", filename);
    if (fs.existsSync(pubFile)) {
      return res.sendFile(pubFile);
    }
    if (fs.existsSync(distFile)) {
      return res.sendFile(distFile);
    }
    next();
  });

  // Serve static assets directly from src/assets or dist/src/assets
  // so that static string asset paths (e.g. /src/assets/images/...) work seamlessly in both development and production
  const localSrcAssets = path.join(process.cwd(), "src/assets");
  const distSrcAssets = path.join(process.cwd(), "dist/src/assets");
  if (fs.existsSync(localSrcAssets)) {
    app.use("/src/assets", express.static(localSrcAssets));
  } else if (fs.existsSync(distSrcAssets)) {
    app.use("/src/assets", express.static(distSrcAssets));
  }

  // Serve static assets or mount Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
