/**
 * Client-side high performance image compressor and persistent storage manager.
 * Ensures that images uploaded in browser (even on static LIVE hosting like Vercel)
 * are optimized to ~120-250KB before storing in localStorage, avoiding QuotaExceededError
 * and rendering instantaneously across all treatment cards, monographs, and hero banners.
 */
import { safeStorage } from "./storage";

export function optimizeImageForStorage(
  file: File,
  maxDimension = 1600,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Wybrany plik nie jest obrazem."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Błąd odczytu pliku"));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error("Pusty plik"));
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(src); // fallback to raw data if decoding fails
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Scale down if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const mime = file.type === "image/png" ? "image/webp" : "image/jpeg";
          const optimizedDataUrl = canvas.toDataURL(mime, quality);
          resolve(optimizedDataUrl);
        } catch {
          resolve(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Saves a custom image for a given slot/treatment key.
 * Persists in safeStorage and localStorage, attempts server backup, and notifies all components.
 */
export async function saveTreatmentCustomImage(
  slotKey: string,
  dataUrl: string
): Promise<{ success: boolean; url: string }> {
  let targetUrl = dataUrl;

  // 1. Try server persistence if backend API endpoint is accessible
  try {
    const resp = await fetch("/api/upload-treatment-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataUrl,
        treatmentKey: slotKey
      })
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.success && data.url) {
        targetUrl = data.url;
      }
    }
  } catch {
    // Expected on static production hosting (e.g. Vercel)
  }

  // 2. Persist in localStorage & safeStorage
  try {
    safeStorage.setItem(`custom_img_${slotKey}`, targetUrl);
    if (slotKey === "hero") {
      safeStorage.setItem("custom_hero_image", targetUrl);
    }
  } catch (err) {
    console.warn("Storage quota warning:", err);
  }

  // 3. Dispatch global event so all components react immediately
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("slowskin_custom_image_updated", {
        detail: { slotKey, url: targetUrl }
      })
    );
  }

  return { success: true, url: targetUrl };
}

/**
 * Exports all custom uploaded images as JSON backup
 */
export function exportAllCustomImages(): string {
  if (typeof window === "undefined") return "{}";
  const backup: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("custom_img_") || k === "custom_hero_image")) {
        const val = safeStorage.getItem(k);
        if (val) backup[k] = val;
      }
    }
  } catch {}
  return JSON.stringify(backup, null, 2);
}

/**
 * Restores custom images from JSON backup
 */
export function importCustomImages(jsonStr: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const parsed = JSON.parse(jsonStr) as Record<string, string>;
    let count = 0;
    for (const [key, val] of Object.entries(parsed)) {
      if (key.startsWith("custom_img_") || key === "custom_hero_image") {
        safeStorage.setItem(key, val);
        const slotKey = key.replace("custom_img_", "");
        window.dispatchEvent(
          new CustomEvent("slowskin_custom_image_updated", {
            detail: { slotKey, url: val }
          })
        );
        count++;
      }
    }
    return count;
  } catch {
    return 0;
  }
}
