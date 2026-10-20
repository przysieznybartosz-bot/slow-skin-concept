import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Persistent Storage Adapter for Slow Skin Concept
 * 
 * Implements:
 * 1. Backend-only service_role access (RLS strictly revokes anon/authenticated access).
 * 2. Persistent storage for AES-256-GCM encrypted Google refresh tokens.
 * 3. Expiring, single-use OAuth states with atomic consumption to eliminate replay attacks.
 * 4. Booking collision tracking, idempotency, and partial-failure recovery between DB and Google.
 */

let cachedClient: SupabaseClient | null = null;

export function getSupabaseConfig(): {
  url: string | null;
  serviceRoleKey: string | null;
  isConfigured: boolean;
} {
  let url = process.env.SUPABASE_URL?.trim() || null;
  if (url) {
    try {
      const parsed = new URL(url);
      url = `${parsed.protocol}//${parsed.host}`;
    } catch {
      url = url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
    }
  }
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;

  return {
    url,
    serviceRoleKey,
    isConfigured: Boolean(url && serviceRoleKey),
  };
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.serviceRoleKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(config.url, config.serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
}

export function isSupabaseAvailable(): boolean {
  return getSupabaseConfig().isConfigured;
}

/**
 * Saves encrypted refresh token into Supabase table slowskin_google_oauth_tokens
 */
export async function saveOAuthTokenToSupabase(params: {
  accountEmail: string;
  calendarId: string;
  encryptedRefreshToken: string;
  scope?: string;
}): Promise<void> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error(
      "Supabase nie jest skonfigurowane w środowisku serwera (wymagane SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY). Zapis tokenu do bazy niemożliwy."
    );
  }

  const { error } = await client
    .from("slowskin_google_oauth_tokens")
    .upsert({
      id: "salon_primary",
      account_email: params.accountEmail,
      calendar_id: params.calendarId,
      encrypted_refresh_token: params.encryptedRefreshToken,
      scope: params.scope || "calendar.events,calendar.readonly",
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(`Błąd zapisu tokenu w bazie Supabase: ${error.message}`);
  }
}

/**
 * Retrieves encrypted refresh token from Supabase
 */
export async function getOAuthTokenFromSupabase(): Promise<{
  encryptedRefreshToken: string;
  accountEmail: string;
  calendarId: string;
} | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("slowskin_google_oauth_tokens")
    .select("encrypted_refresh_token, account_email, calendar_id")
    .eq("id", "salon_primary")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    encryptedRefreshToken: data.encrypted_refresh_token,
    accountEmail: data.account_email,
    calendarId: data.calendar_id,
  };
}

/**
 * Removes OAuth token from Supabase
 */
export async function removeOAuthTokenFromSupabase(): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const { error } = await client
    .from("slowskin_google_oauth_tokens")
    .delete()
    .eq("id", "salon_primary");

  if (error) {
    console.error(`[SupabaseStore] Błąd usuwania tokenu z bazy: ${error.message}`);
  }
}

/**
 * Saves an OAuth state in Supabase with 10-minute expiry
 */
export async function saveOAuthStateInSupabase(params: {
  stateId: string;
  sessionId: string;
  redirectUri: string;
  codeChallenge?: string;
  expiresAt: number;
}): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const { error } = await client.from("slowskin_oauth_states").insert({
    state_id: params.stateId,
    session_id: params.sessionId,
    redirect_uri: params.redirectUri,
    code_challenge: params.codeChallenge || null,
    consumed: false,
    expires_at: new Date(params.expiresAt).toISOString(),
  });

  if (error) {
    console.error(`[SupabaseStore] Błąd zapisu stanu OAuth w bazie: ${error.message}`);
    throw new Error(`Nie udało się zapisać stanu OAuth w bazie Supabase: ${error.message}`);
  }
}

/**
 * Atomically validates and consumes an OAuth state in Supabase
 */
export async function atomicConsumeOAuthStateInSupabase(stateId: string): Promise<{
  valid: boolean;
  sessionId?: string;
  redirectUri?: string;
  codeChallenge?: string;
  error?: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    // If Supabase is not configured, fallback handled in memory
    return { valid: false, error: "Baza Supabase niedostępna." };
  }

  // Use the atomic stored function defined in migration
  const { data, error } = await client.rpc("consume_slowskin_oauth_state", {
    p_state_id: stateId,
  });

  if (error) {
    // Fallback direct update query if stored function not yet migrated
    const nowIso = new Date().toISOString();
    const { data: updateData, error: updateErr } = await client
      .from("slowskin_oauth_states")
      .update({ consumed: true, consumed_at: nowIso })
      .eq("state_id", stateId)
      .eq("consumed", false)
      .gt("expires_at", nowIso)
      .select("session_id, redirect_uri, code_challenge")
      .maybeSingle();

    if (updateErr || !updateData) {
      return {
        valid: false,
        error: "Nieprawidłowy, wygasły lub zużyty stan OAuth w bazie danych.",
      };
    }

    return {
      valid: true,
      sessionId: updateData.session_id,
      redirectUri: updateData.redirect_uri,
      codeChallenge: updateData.code_challenge,
    };
  }

  if (Array.isArray(data) && data.length > 0) {
    const row = data[0];
    if (!row.valid) {
      return { valid: false, error: row.error_message || "Stan OAuth odrzucony przez bazę." };
    }
    return {
      valid: true,
      sessionId: row.session_id,
      redirectUri: row.redirect_uri,
      codeChallenge: row.code_challenge,
    };
  }

  return { valid: false, error: "Stan OAuth nie został odnaleziony." };
}

/**
 * Checks for collision with existing confirmed bookings in Supabase
 */
export async function checkBookingCollisionInSupabase(
  startTime: Date,
  totalBlockedEndTime: Date
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  const startIso = startTime.toISOString();
  const endIso = totalBlockedEndTime.toISOString();

  // Overlap condition: existing.start < new.total_end AND existing.total_end > new.start
  // All active statuses retain the slot lock: confirmed, pending, google_synced, google_sync_failed.
  // ONLY explicitly cancelled bookings release the slot.
  const { data, error } = await client
    .from("slowskin_bookings")
    .select("id")
    .in("status", ["confirmed", "pending", "google_synced", "google_sync_failed"])
    .lt("start_time", endIso)
    .gt("total_blocked_end_time", startIso)
    .limit(1);

  if (error) {
    console.error("[SupabaseStore] Błąd sprawdzania kolizji w bazie:", error.message);
    throw new Error(`Błąd weryfikacji kolizji terminów w bazie Supabase: ${error.message}`);
  }

  return Array.isArray(data) && data.length > 0;
}

/**
 * Retrieves an existing booking record by idempotency key
 */
export async function getBookingByIdempotencyKey(key: string): Promise<any | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client
    .from("slowskin_bookings")
    .select("*")
    .eq("idempotency_key", key)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

/**
 * Saves a new booking with idempotency key and initial status
 */
export async function saveBookingToSupabase(booking: {
  id: string;
  treatmentId: string;
  treatmentName: string;
  durationMinutes: number;
  bufferMinutes?: number;
  price: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  dateStr: string;
  timeStr: string;
  startTime: Date;
  endTime: Date;
  totalBlockedEndTime: Date;
  idempotencyKey?: string;
  notes?: string;
}): Promise<{
  success: boolean;
  id: string;
  error?: string;
  isExclusionConflict?: boolean;
  isIdempotencyConflict?: boolean;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, id: booking.id, error: "Baza Supabase nie jest skonfigurowana." };
  }

  const { error } = await client.from("slowskin_bookings").insert({
    id: booking.id,
    treatment_id: booking.treatmentId,
    treatment_name: booking.treatmentName,
    duration_minutes: booking.durationMinutes,
    buffer_minutes: booking.bufferMinutes ?? 15,
    price: booking.price,
    client_name: booking.clientName,
    client_phone: booking.clientPhone,
    client_email: booking.clientEmail,
    date_str: booking.dateStr,
    time_str: booking.timeStr,
    start_time: booking.startTime.toISOString(),
    end_time: booking.endTime.toISOString(),
    total_blocked_end_time: booking.totalBlockedEndTime.toISOString(),
    status: "confirmed",
    idempotency_key: booking.idempotencyKey || booking.id,
    notes: booking.notes || null,
  });

  if (error) {
    const isExclusionConflict =
      error.code === "23P01" ||
      error.message?.includes("no_overlapping_active_bookings") ||
      error.message?.includes("exclusion constraint");
    const isIdempotencyConflict =
      error.code === "23505" ||
      error.message?.includes("idempotency_key") ||
      error.message?.includes("duplicate key") ||
      error.message?.includes("unique constraint");

    return {
      success: false,
      id: booking.id,
      error: error.message,
      isExclusionConflict,
      isIdempotencyConflict,
    };
  }

  return { success: true, id: booking.id };
}

/**
 * Updates booking sync status after Google Calendar operation
 */
export async function updateBookingGoogleSyncStatus(params: {
  bookingId: string;
  status: "google_synced" | "google_sync_failed";
  googleEventId?: string;
  syncError?: string;
}): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  await client
    .from("slowskin_bookings")
    .update({
      status: params.status,
      google_event_id: params.googleEventId || null,
      google_sync_error: params.syncError || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.bookingId);
}

/**
 * Safely cancels a booking and explicitly releases the time slot lock in PostgreSQL
 */
export async function cancelBookingInSupabase(bookingId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  const { error } = await client
    .from("slowskin_bookings")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  return !error;
}
