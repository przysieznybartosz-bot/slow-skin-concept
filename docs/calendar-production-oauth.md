# Production calendar OAuth repair — 18 October 2026

## Verified deployment mismatch

`slow-skin-concept.pl` resolves to Vercel project `slow-skin-concept`, team `kart4`, production deployment `dpl_3RWbHDTXvxnT9j9TCULE9FynmahK`, commit `b1f9f4b5e446bb3e516f70812e6c773b162ae858`.
That commit calls browser Firebase/GSI from the staff calendar button and stores server refresh tokens in a local file. Neither main nor the existing ESM repair branch contains the AI Studio Supabase/PKCE implementation described in chat.

Vercel originally had only GEMINI_API_KEY, OPENAI_API_KEY, VITE_GOOGLE_CLIENT_ID, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY and APP_URL. AI Studio Secrets are not Vercel environment variables.

Read-only inspection of the existing `slow-skin-concept-booking` Supabase project (`tzefvdqbjbgyshgomfwl`) found **zero token rows and zero booking rows** on 18 October. Existing OAuth state columns and the atomic consume RPC match this implementation. No data, schema or encryption keys were changed. This does not establish why the earlier token disappeared.

## Changes

Staff connection now uses server sessions and the explicit backend OAuth client, with session-bound PKCE/state and one-time PostgreSQL state consumption. Tokens are AES-GCM encrypted using the same key derivation as AI Studio and read back from Supabase before callback success. No refresh-token memory or local-file fallback is used.

Express and Vercel use the same login/callback handlers. Staff PINs are validated on the server; client-local unlock flags and default PINs no longer authorize the panel. Failed PIN attempts are stored as consumed, expiring entries in the existing state table, counted per hashed IP across instances; this is not an atomic rate-limiter under concurrent attempts. No schema change is introduced.

Calendar status distinguishes missing token from configuration/storage/API errors. Network requests are bounded. Staff synchronization and visitor availability refresh do not start Firebase Calendar authorization. Availability checks both calendars and uses Warsaw offsets for summer/winter dates. Existing optional customer Google sign-in remains separate and still needs its own Firebase origin configuration if used; it cannot connect the salon calendar.

## Release prerequisites

Set the following **Production** secrets at https://vercel.com/kart4/slow-skin-concept/settings/environment-variables, copying the existing matching values directly from AI Studio (never through chat or Git):

- GOOGLE_CLIENT_SECRET — for client 7822649160-gk295lkjnlg4h5a6kon2bhehkj6mf0cu.apps.googleusercontent.com
- SUPABASE_SERVICE_ROLE_KEY — for tzefvdqbjbgyshgomfwl
- ADMIN_PIN — at least 6 characters
- ADMIN_JWT_SECRET — existing 64 hex characters
- TOKEN_ENCRYPTION_KEY — existing 64 hex characters, preserve it

The four non-secret production variables GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_CALENDAR_ID and SUPABASE_URL were provisioned separately. Do not put server credentials in VITE variables. Preview does not receive production secrets.

Register `https://slow-skin-concept.pl/api/calendar/auth/callback` in the backend OAuth client's authorized redirect URIs. Do not add the production origin to the old Firebase client as a substitute for the staff repair. This flow redirects server-side and does not require JavaScript Calendar authorization.

Deploy this exact reviewed commit only after configuration. Open `/?admin=true`, log in, connect the salon account and complete Google consent. Confirm the token row exists without printing its encrypted contents; repeat status and availability from a fresh runtime. Confirm 19–23 October busy periods through real Google FreeBusy and both forms. No live booking or invitation is created by the regression suite.

## Validation and limits

Local TypeScript, build, five existing tests and nine new regression tests are run. New network tests use mocked Supabase responses; PKCE URL/session tests use the actual handlers. They do not prove live Google authorization, database grants or browser behavior. Those checks require the release secrets and manual Google consent. This PR does not port the entire AI Studio booking persistence/cancellation workflow; the production booking endpoint still needs that workflow before a full end-to-end booking readiness claim.
