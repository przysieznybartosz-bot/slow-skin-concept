-- Migration: 20261014110000_slowskin_google_oauth_booking.sql
-- Description: Private storage for Slow Skin Concept Google Calendar integration,
-- OAuth states, PKCE verifications, appointments, and collision prevention.
-- Modeled after proven MotoMateo Supabase patterns, adapted for Slow Skin.

-- 1. Table for encrypted Google OAuth tokens
CREATE TABLE IF NOT EXISTS public.slowskin_google_oauth_tokens (
    id TEXT PRIMARY KEY DEFAULT 'salon_primary',
    account_email TEXT NOT NULL,
    calendar_id TEXT NOT NULL,
    encrypted_refresh_token TEXT NOT NULL,
    scope TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security for OAuth tokens: STRICT BACKEND ONLY
ALTER TABLE public.slowskin_google_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Revoke all public/client access
REVOKE ALL ON public.slowskin_google_oauth_tokens FROM anon, authenticated;
GRANT ALL ON public.slowskin_google_oauth_tokens TO service_role;

-- 2. Table for expiring, single-use OAuth states and PKCE challenges
CREATE TABLE IF NOT EXISTS public.slowskin_oauth_states (
    state_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    redirect_uri TEXT NOT NULL,
    code_challenge TEXT,
    consumed BOOLEAN NOT NULL DEFAULT FALSE,
    consumed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.slowskin_oauth_states ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.slowskin_oauth_states FROM anon, authenticated;
GRANT ALL ON public.slowskin_oauth_states TO service_role;

CREATE INDEX IF NOT EXISTS idx_slowskin_oauth_states_expires 
    ON public.slowskin_oauth_states (expires_at);

-- Atomic state consumption function to prevent race conditions and replay attacks
CREATE OR REPLACE FUNCTION public.consume_slowskin_oauth_state(
    p_state_id TEXT
) RETURNS TABLE (
    valid BOOLEAN,
    session_id TEXT,
    redirect_uri TEXT,
    code_challenge TEXT,
    error_message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_record RECORD;
BEGIN
    SELECT * INTO v_record
    FROM public.slowskin_oauth_states
    WHERE state_id = p_state_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'Stan OAuth (state) nie istnieje w bazie.';
        RETURN;
    END IF;

    IF v_record.consumed THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'Stan OAuth został już wcześniej wykorzystany (ochrona przed replay).';
        RETURN;
    END IF;

    IF v_record.expires_at < NOW() THEN
        RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'Stan OAuth wygasł (maksymalny czas 10 minut).';
        RETURN;
    END IF;

    -- Mark as consumed atomically
    UPDATE public.slowskin_oauth_states
    SET consumed = TRUE, consumed_at = NOW()
    WHERE state_id = p_state_id;

    RETURN QUERY SELECT TRUE, v_record.session_id, v_record.redirect_uri, v_record.code_challenge, NULL::TEXT;
END;
$$;

-- Explicitly revoke execute on the RPC function from anon and authenticated, grant only to service_role
REVOKE EXECUTE ON FUNCTION public.consume_slowskin_oauth_state(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_slowskin_oauth_state(TEXT) TO service_role;

-- 3. Table for reservations, collision prevention, and sync state tracking
CREATE TABLE IF NOT EXISTS public.slowskin_bookings (
    id TEXT PRIMARY KEY,
    treatment_id TEXT NOT NULL,
    treatment_name TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    buffer_minutes INTEGER NOT NULL DEFAULT 15,
    price TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT NOT NULL,
    date_str TEXT NOT NULL, -- YYYY-MM-DD in Europe/Warsaw
    time_str TEXT NOT NULL, -- HH:MM in Europe/Warsaw
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_blocked_end_time TIMESTAMPTZ NOT NULL, -- includes 15m buffer
    status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed, pending, google_synced, google_sync_failed, cancelled
    google_event_id TEXT,
    google_sync_error TEXT,
    idempotency_key TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.slowskin_bookings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.slowskin_bookings FROM anon, authenticated;
GRANT ALL ON public.slowskin_bookings TO service_role;

CREATE INDEX IF NOT EXISTS idx_slowskin_bookings_date 
    ON public.slowskin_bookings (date_str, status);
CREATE INDEX IF NOT EXISTS idx_slowskin_bookings_range 
    ON public.slowskin_bookings (start_time, total_blocked_end_time);

-- 4. Atomic exclusion constraint on overlapping time intervals with buffer.
-- Requires btree_gist extension (standard in Supabase).
-- Only cancelled bookings release the lock; google_sync_failed retains the lock.
CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_active_bookings'
    ) THEN
        ALTER TABLE public.slowskin_bookings
            ADD CONSTRAINT no_overlapping_active_bookings
            EXCLUDE USING gist (
                tstzrange(start_time, total_blocked_end_time) WITH &&
            )
            WHERE (status IN ('confirmed', 'pending', 'google_synced', 'google_sync_failed'));
    END IF;
END $$;
