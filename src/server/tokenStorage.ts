import crypto from "node:crypto";
import {
  isSupabaseAvailable,
  saveOAuthTokenToSupabase,
  getOAuthTokenFromSupabase,
  removeOAuthTokenFromSupabase,
} from "./supabaseStore.js";

/**
 * Moduł trwałego, zaszyfrowanego magazynu tokenów Slow Skin Concept.
 * 
 * Zasady bezpieczeństwa:
 * 1. AES-256-GCM z uwierzytelnionym tagiem (authenticated encryption).
 * 2. Osobny klucz TOKEN_ENCRYPTION_KEY — NIE jest wyprowadzany z GOOGLE_CLIENT_SECRET.
 *    Zmiana sekretu Google nie wpływa na możliwość odczytu zapisanych tokenów.
 * 3. Bezpieczne przejście i migracja: jeśli istnieją tokeny zaszyfrowane starym kluczem
 *    (np. TOKEN_ENCRYPTION_KEY_FALLBACK lub dawny sekret klienta), funkcja automatycznie
 *    odczytuje token i przeprowadza natychmiastowe przepisanie (re-encryption) do bazy nowym kluczem.
 * 4. Całkowite odcięcie pliku .calendar_token.json ze ścieżki zapisu w produkcji.
 * 5. Błąd zapisu do bazy przerywa proces (brak fałszywego sukcesu).
 */

const ALGORITHM = "aes-256-gcm";

/**
 * Zwraca 256-bitowy bufor klucza dla AES-256-GCM wyprowadzony z dedykowanego TOKEN_ENCRYPTION_KEY.
 */
function getPrimaryEncryptionKey(): Buffer {
  const secret = process.env.TOKEN_ENCRYPTION_KEY?.trim();
  if (secret) {
    return crypto.createHash("sha256").update(secret).digest();
  }

  // W środowisku testów jednostkowych pozwalamy na bezpieczny klucz testowy
  if (process.env.NODE_ENV === "test") {
    return crypto.createHash("sha256").update("slowskin-test-encryption-key-isolated-2026").digest();
  }

  throw new Error(
    "Brak dedykowanego klucza TOKEN_ENCRYPTION_KEY w zmiennych serwera. Szyfrowanie tokenu zostało zablokowane. Skonfiguruj osobną zmienną TOKEN_ENCRYPTION_KEY."
  );
}

/**
 * Zwraca opcjonalne klucze rezerwowe/przejściowe używane wyłącznie do bezpiecznego odczytu
 * tokenów zapisanych przed rotacją lub przed rozdzieleniem od GOOGLE_CLIENT_SECRET.
 */
function getFallbackKeys(): Buffer[] {
  const fallbackSecrets = [
    process.env.TOKEN_ENCRYPTION_KEY_FALLBACK?.trim(),
    process.env.GOOGLE_CLIENT_SECRET?.trim(), // tylko do odczytu danych historycznych podczas migracji
  ].filter(Boolean) as string[];

  return fallbackSecrets.map((s) => crypto.createHash("sha256").update(s).digest());
}

/**
 * Szyfruje ciąg tekstowy za pomocą AES-256-GCM wyłącznie przy użyciu TOKEN_ENCRYPTION_KEY.
 * Format: iv_hex:auth_tag_hex:ciphertext_hex
 */
export function encryptToken(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getPrimaryEncryptionKey(), iv);
  let encrypted = cipher.update(plainText, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Pomocnicza funkcja deszyfrująca danym kluczem buforowym.
 */
function tryDecryptWithKey(encryptedPayload: string, keyBuffer: Buffer): string | null {
  try {
    const parts = encryptedPayload.split(":");
    if (parts.length !== 3) {
      if (encryptedPayload.startsWith("1//") || (encryptedPayload.length > 20 && !encryptedPayload.includes(":"))) {
        return encryptedPayload; // token jawny z konfiguracji awaryjnej
      }
      return null;
    }
    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch {
    return null;
  }
}

/**
 * Odszyfrowuje token.
 * Krok 1: Próba odszyfrowania głównym TOKEN_ENCRYPTION_KEY.
 * Krok 2: Jeśli to zawiedzie (np. po rotacji klucza), próba odszyfrowania kluczami archiwalnymi.
 * Zwraca obiekt z odszyfrowanym tokenem oraz informacją, czy wymagana jest re-enkrypcja.
 */
export function decryptTokenWithMigration(encryptedPayload: string): {
  token: string | null;
  needsReEncryption: boolean;
} {
  // 1. Próba z głównym kluczem
  try {
    const primaryKey = getPrimaryEncryptionKey();
    const result = tryDecryptWithKey(encryptedPayload, primaryKey);
    if (result) {
      return { token: result, needsReEncryption: false };
    }
  } catch {
    // Primary key missing or invalid
  }

  // 2. Bezpieczne przejście / fallback dla danych historycznych
  const fallbackKeys = getFallbackKeys();
  for (const fKey of fallbackKeys) {
    const result = tryDecryptWithKey(encryptedPayload, fKey);
    if (result) {
      console.warn("[TokenStorage] Pomyślnie odczytano token kluczem przejściowym. Wskazana re-enkrypcja nowym TOKEN_ENCRYPTION_KEY.");
      return { token: result, needsReEncryption: true };
    }
  }

  return { token: null, needsReEncryption: false };
}

/**
 * Prosty interfejs odszyfrowania zachowujący kompatybilność.
 */
export function decryptToken(encryptedPayload: string): string | null {
  return decryptTokenWithMigration(encryptedPayload).token;
}

export interface StoredTokenMetadata {
  storageMethod: "supabase" | "env" | "memory_test";
  updatedAt: string;
}

let memoryTestToken: string | null = null;
let cachedDecryptedToken: string | null = null;

/**
 * Pobiera refresh token z trwałego magazynu.
 * Kolejność:
 * 1. Supabase PostgreSQL (slowskin_google_oauth_tokens) — z automatyczną migracją klucza
 * 2. Zmienna środowiskowa GOOGLE_REFRESH_TOKEN (jawna administracyjna)
 * 3. Zmienna środowiskowa ENCRYPTED_GOOGLE_REFRESH_TOKEN
 * 4. Izolowany stan testowy w pamięci
 */
export async function getStoredRefreshTokenAsync(): Promise<string | null> {
  // 1. Supabase PostgreSQL
  if (isSupabaseAvailable()) {
    try {
      const dbRecord = await getOAuthTokenFromSupabase();
      if (dbRecord?.encryptedRefreshToken) {
        const { token, needsReEncryption } = decryptTokenWithMigration(dbRecord.encryptedRefreshToken);
        if (token) {
          cachedDecryptedToken = token;
          process.env.GOOGLE_REFRESH_TOKEN = token;
          // Jeśli token został odczytany starym kluczem, automatycznie przepisujemy go nowym kluczem
          if (needsReEncryption) {
            try {
              console.log("[TokenStorage] Automatyczna re-enkrypcja tokenu nowym kluczem TOKEN_ENCRYPTION_KEY...");
              await saveStoredRefreshToken(token, {
                accountEmail: dbRecord.accountEmail,
                calendarId: dbRecord.calendarId,
              });
            } catch (reErr: any) {
              console.warn("[TokenStorage] Ostrzeżenie: nie udało się zaktualizować tokenu nowym kluczem:", reErr.message);
            }
          }
          return token;
        }
      }
    } catch (e: any) {
      console.error("[TokenStorage] Błąd pobierania tokenu z Supabase:", e.message);
    }
  }

  // 2. Jawny refresh token z pamięci procesu lub env (świadomy wariant administracyjny)
  if (cachedDecryptedToken) {
    return cachedDecryptedToken;
  }
  if (process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_REFRESH_TOKEN.trim()) {
    cachedDecryptedToken = process.env.GOOGLE_REFRESH_TOKEN.trim();
    return cachedDecryptedToken;
  }

  // 3. Zaszyfrowany token z env
  if (process.env.ENCRYPTED_GOOGLE_REFRESH_TOKEN && process.env.ENCRYPTED_GOOGLE_REFRESH_TOKEN.trim()) {
    const decrypted = decryptToken(process.env.ENCRYPTED_GOOGLE_REFRESH_TOKEN.trim());
    if (decrypted) {
      cachedDecryptedToken = decrypted;
      return decrypted;
    }
  }

  // 4. Testy
  if (process.env.NODE_ENV === "test" && memoryTestToken) {
    return memoryTestToken;
  }

  return null;
}

export function getStoredRefreshToken(): string | null {
  if (cachedDecryptedToken) {
    return cachedDecryptedToken;
  }
  if (process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_REFRESH_TOKEN.trim()) {
    return process.env.GOOGLE_REFRESH_TOKEN.trim();
  }
  if (process.env.ENCRYPTED_GOOGLE_REFRESH_TOKEN && process.env.ENCRYPTED_GOOGLE_REFRESH_TOKEN.trim()) {
    const dec = decryptToken(process.env.ENCRYPTED_GOOGLE_REFRESH_TOKEN.trim());
    if (dec) {
      cachedDecryptedToken = dec;
      return dec;
    }
  }
  if (process.env.NODE_ENV === "test" && memoryTestToken) {
    return memoryTestToken;
  }
  return null;
}

/**
 * Trwale zapisuje refresh token w zaszyfrowanym formacie (AES-256-GCM).
 * - Główna ścieżka produkcyjna: Supabase PostgreSQL
 * - Nigdy nie tworzy lokalnego pliku .calendar_token.json
 * - Rzuca wyjątek w razie błędu bazy.
 */
export async function saveStoredRefreshToken(
  refreshToken: string,
  meta?: { accountEmail?: string; calendarId?: string }
): Promise<StoredTokenMetadata> {
  const trimmed = refreshToken.trim();
  if (!trimmed) {
    throw new Error("Nie można zapisać pustego refresh tokenu.");
  }

  const encrypted = encryptToken(trimmed);
  const now = new Date().toISOString();

  // Uaktualnienie w bieżącym procesie
  cachedDecryptedToken = trimmed;
  process.env.GOOGLE_REFRESH_TOKEN = trimmed;

  if (isSupabaseAvailable()) {
    await saveOAuthTokenToSupabase({
      accountEmail: meta?.accountEmail || "slowskinconcept@gmail.com",
      calendarId:
        meta?.calendarId ||
        process.env.GOOGLE_CALENDAR_ID ||
        "slowskinconcept@gmail.com",
      encryptedRefreshToken: encrypted,
    });
    return {
      storageMethod: "supabase",
      updatedAt: now,
    };
  }

  if (process.env.NODE_ENV === "test") {
    memoryTestToken = trimmed;
    return {
      storageMethod: "memory_test",
      updatedAt: now,
    };
  }

  const errorMsg =
    "Brak trwałego magazynu Supabase (wymagane SUPABASE_URL oraz SUPABASE_SERVICE_ROLE_KEY). Zapis tokenu do bazy został przerwany. Baza nie została podłączona — skonfiguruj SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY.";
  console.error(`[TokenStorage] ${errorMsg}`);
  throw new Error(errorMsg);
}

/**
 * Usuwa token z magazynu przy odłączeniu kalendarza.
 */
export async function removeStoredRefreshToken(): Promise<void> {
  cachedDecryptedToken = null;
  delete process.env.GOOGLE_REFRESH_TOKEN;
  delete process.env.ENCRYPTED_GOOGLE_REFRESH_TOKEN;
  memoryTestToken = null;
  if (isSupabaseAvailable()) {
    await removeOAuthTokenFromSupabase();
  }
}
