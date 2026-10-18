import crypto from 'node:crypto';

export const SALON_EMAIL = 'slowskinconcept@gmail.com';
export const BACKEND_CLIENT_ID = '7822649160-gk295lkjnlg4h5a6kon2bhehkj6mf0cu.apps.googleusercontent.com';

export function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Brak konfiguracji serwera: ${name}`);
  return value;
}

export function sessionKey() {
  const secret = required('ADMIN_JWT_SECRET');
  if (!/^[a-f0-9]{64}$/i.test(secret)) throw new Error('ADMIN_JWT_SECRET musi mieć 64 znaki hex.');
  return Buffer.from(secret, 'hex');
}

export function encryptionKey() {
  const secret = required('TOKEN_ENCRYPTION_KEY');
  if (!/^[a-f0-9]{64}$/i.test(secret)) throw new Error('TOKEN_ENCRYPTION_KEY musi mieć 64 znaki hex.');
  // Preserve the derivation used by the existing AI Studio token store.
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptToken(token: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const data = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${data.toString('hex')}`;
}

export function decryptToken(payload: string) {
  if (!/^[a-f0-9]{24}:[a-f0-9]{32}:(?:[a-f0-9]{2})+$/i.test(payload)) throw new Error('Nieprawidłowy format zaszyfrowanego tokenu.');
  const [iv, tag, data] = payload.split(':').map(x => Buffer.from(x, 'hex'));
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}

export async function database(path: string, init: RequestInit = {}) {
  const url = new URL(required('SUPABASE_URL'));
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Nieprawidłowy SUPABASE_URL.');
  const key = required('SUPABASE_SERVICE_ROLE_KEY');
  const response = await fetch(`${url.origin}/rest/v1/${path}`, {
    ...init, signal: AbortSignal.timeout(10000),
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...init.headers },
  });
  if (!response.ok) throw new Error(`Błąd magazynu kalendarza (HTTP ${response.status}).`);
  // PostgREST return=minimal can reply 201 Created with an empty body.
  const body = await response.text();
  if (!body.trim()) return null;
  try { return JSON.parse(body); }
  catch { throw new Error('Nieprawidłowa odpowiedź JSON magazynu kalendarza.'); }
}

export async function readRefreshToken(): Promise<string | null> {
  const records = await database('slowskin_google_oauth_tokens?id=eq.salon_primary&select=encrypted_refresh_token,account_email');
  if (!Array.isArray(records)) throw new Error('Nieprawidłowa odpowiedź magazynu tokenów.');
  if (!records.length) return null;
  if (records[0].account_email !== SALON_EMAIL) throw new Error('Token należy do innego konta.');
  return decryptToken(records[0].encrypted_refresh_token);
}

export async function writeRefreshToken(token: string, calendarId: string) {
  if (!token?.trim()) throw new Error('Brak refresh tokenu.');
  await database('slowskin_google_oauth_tokens?on_conflict=id', {
    method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: 'salon_primary', account_email: SALON_EMAIL, calendar_id: calendarId,
      encrypted_refresh_token: encryptToken(token), updated_at: new Date().toISOString() }),
  });
  // Success requires a fresh read; never cache a token before confirming persistence.
  if (await readRefreshToken() !== token) throw new Error('Nie potwierdzono trwałego zapisu tokenu.');
}

export function cookie(req: any, name: string) {
  return String(req.headers?.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(`${name}=`))?.slice(name.length + 1) || '';
}

export function signed(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${crypto.createHmac('sha256', sessionKey()).update(body).digest('base64url')}`;
}

export function unsign(value: string): any {
  try {
    const [body, signature, extra] = value.split('.');
    const expected = crypto.createHmac('sha256', sessionKey()).update(body).digest();
    const actual = Buffer.from(signature || '', 'base64url');
    if (extra || actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
    const data = JSON.parse(Buffer.from(body, 'base64url').toString());
    return Number.isFinite(data.exp) && data.exp > Date.now() ? data : null;
  } catch { return null; }
}

export function session(req: any) {
  const data = unsign(cookie(req, 'slowskin_admin_session'));
  return data?.type === 'admin' && typeof data.sid === 'string' ? data : null;
}

export function setCookie(res: any, name: string, value: string, seconds: number) {
  const previous = res.getHeader('Set-Cookie');
  res.setHeader('Set-Cookie', [...(Array.isArray(previous) ? previous : previous ? [String(previous)] : []),
    `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${seconds}`]);
}

export function json(res: any, status: number, body: any) {
  res.statusCode = status;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export function sameOrigin(req: any) {
  const origin = req.headers?.origin;
  return !origin || origin === `https://${req.headers?.host}`;
}

// Durable state store below is also used to count failed PIN attempts across serverless instances.
export async function adminHandler(req: any, res: any, action: string) {
  try {
    if (action === 'session' && req.method === 'GET') return json(res, 200, { isAdmin: !!session(req) });
    if (req.method !== 'POST') return json(res, 405, { error: 'Metoda niedozwolona.' });
    if (!sameOrigin(req)) return json(res, 403, { error: 'Niedozwolone źródło żądania.' });
    if (action === 'logout') {
      setCookie(res, 'slowskin_admin_session', '', 0);
      return json(res, 200, { success: true });
    }
    const configuredPin = required('ADMIN_PIN');
    if (configuredPin.length < 6 || /^(.)\1+$/.test(configuredPin)) throw new Error('ADMIN_PIN musi mieć minimum 6 znaków i nie może być powtarzającym się znakiem.');
    sessionKey();
    const ip = String(req.headers?.['x-vercel-forwarded-for'] || req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
    const bucket = crypto.createHmac('sha256', sessionKey()).update(ip).digest('hex');
    const attempts = await database(`slowskin_oauth_states?session_id=eq.pin_${bucket}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&select=state_id&limit=5`);
    if (!Array.isArray(attempts)) throw new Error('Błąd limitu logowania.');
    if (attempts.length >= 5) {
      res.setHeader('Retry-After', '900');
      return json(res, 429, { error: 'Zbyt wiele prób. Spróbuj za 15 minut.' });
    }
    const input = typeof req.body?.pin === 'string' ? req.body.pin : '';
    const hash = (value: string) => crypto.createHash('sha256').update(value).digest();
    if (!crypto.timingSafeEqual(hash(input), hash(configuredPin))) {
      await database('slowskin_oauth_states', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({
        state_id: `pin_${crypto.randomUUID()}`, session_id: `pin_${bucket}`, redirect_uri: 'pin-rate-limit', consumed: true,
        expires_at: new Date(Date.now() + 900000).toISOString(),
      }) });
      return json(res, 401, { error: 'Nieprawidłowy PIN.' });
    }
    setCookie(res, 'slowskin_admin_session', signed({ type: 'admin', sid: crypto.randomUUID(), exp: Date.now() + 8 * 3600000 }), 8 * 3600);
    return json(res, 200, { success: true });
  } catch (error) { return json(res, 503, { error: error instanceof Error ? error.message : 'Błąd logowania.' }); }
}
