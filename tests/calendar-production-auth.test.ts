import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test, after } from 'node:test';
import { encryptToken, decryptToken, signed, session, writeRefreshToken, readRefreshToken, BACKEND_CLIENT_ID, adminHandler } from '../src/server/calendarAuth.js';
import { oauthLogin, oauthCallback, getEffectiveOAuthCredentials } from '../src/server/googleOAuthService.js';
import { warsawInstant, availabilityCalendarIds, getLiveAvailableSlots } from '../src/server/googleCalendarBackend.js';

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
after(() => { globalThis.fetch = originalFetch; process.env = originalEnv; });
Object.assign(process.env, { ADMIN_PIN: '739251', ADMIN_JWT_SECRET: crypto.randomBytes(32).toString('hex'),
  TOKEN_ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex'), SUPABASE_URL: 'https://example.supabase.co/rest/v1/',
  SUPABASE_SERVICE_ROLE_KEY: 'test-private', GOOGLE_CLIENT_ID: BACKEND_CLIENT_ID, GOOGLE_CLIENT_SECRET: 'test-secret',
  GOOGLE_REDIRECT_URI: 'https://slow-skin-concept.pl/api/calendar/auth/callback' });
function response() {
  const headers: Record<string, any> = {};
  return { statusCode: 0, body: '', headers, setHeader(k: string,v: any) { headers[k] = v; }, getHeader(k: string) { return headers[k]; }, end(data = '') { this.body = data; } };
}
const adminCookie = () => `slowskin_admin_session=${signed({ type: 'admin', sid: 'test-session', exp: Date.now()+60000 })}`;
const req = (cookie = '') => ({ method: 'GET', url: '/api/calendar/auth/login', headers: { cookie, host: 'slow-skin-concept.pl', accept: 'application/json' } });

test('salon auth handler never calls browser Firebase and does not trust local storage', () => {
 const app = readFileSync('src/App.tsx', 'utf8');
 const handler = app.slice(app.indexOf('const handleSyncAdminGoogle'), app.indexOf('const handleAddManualBlock'));
 assert.match(handler, /startSalonCalendarOAuth/);
 assert.doesNotMatch(handler, /requestGoogleCalendarAccess|signInWithPopup|syncGoogleCalendarWithBackend/);
 assert.doesNotMatch(app, /pin === "2026"|return safeStorage.getItem\("slowskin_staff_unlocked"\)/);
});

test('no-session OAuth is rejected before accessing storage or Google', async () => {
 globalThis.fetch = async () => { throw new Error('Unexpected request'); };
 const res = response(); await oauthLogin(req(), res); assert.equal(res.statusCode, 401);
});

test('OAuth uses correct backend client, PKCE and durable session-bound state', async () => {
 let stored: any;
 globalThis.fetch = async (url, init) => { assert.equal(String(url), 'https://example.supabase.co/rest/v1/slowskin_oauth_states'); stored=JSON.parse(String(init?.body)); return new Response(null, {status:204}); };
 const res=response(); await oauthLogin(req(adminCookie()),res); assert.equal(res.statusCode,200);
 const url=new URL(JSON.parse(res.body).authUrl);
 assert.equal(url.searchParams.get('client_id'),BACKEND_CLIENT_ID);
 assert.equal(url.searchParams.get('response_type'),'code'); assert.equal(url.searchParams.get('access_type'),'offline');
 assert.equal(url.searchParams.get('code_challenge_method'),'S256'); assert.equal(url.searchParams.get('state'),stored.state_id);
 assert.equal(stored.session_id,'test-session'); assert.equal(stored.redirect_uri,process.env.GOOGLE_REDIRECT_URI);
 assert.match(res.headers['Set-Cookie'][0], /HttpOnly; Secure; SameSite=Lax/);
 assert.ok(!res.body.includes('verifier'));
});

test('legacy client and foreign callback hosts fail closed', async () => {
 const correct=process.env.GOOGLE_CLIENT_ID; process.env.GOOGLE_CLIENT_ID='old-client';
 assert.throws(()=>getEffectiveOAuthCredentials()); process.env.GOOGLE_CLIENT_ID=correct;
 const request=req(adminCookie()); request.headers.host='other.example'; const res=response(); await oauthLogin(request,res); assert.equal(res.statusCode,503);
});

test('callback rejects forged or expired attempt before token exchange', async () => {
 globalThis.fetch=async()=>{throw new Error('Unexpected network access');};
 const res=response(); await oauthCallback({...req(adminCookie()),url:'/api/calendar/auth/callback?code=fake&state=forged'},res);
 assert.equal(res.statusCode,400);
 const expired=signed({type:'admin',sid:'test-session',exp:Date.now()-1000}); assert.equal(session(req(`slowskin_admin_session=${expired}`)),null);
});

test('encrypted token is read back from persistent storage, without memory/env fallback', async () => {
 let record: any;
 globalThis.fetch=async (_url, init)=>{
   if(init?.method==='POST') {record=JSON.parse(String(init.body));return new Response(null,{status:204});}
   return Response.json(record?[record]:[]);
 };
 await writeRefreshToken('test-refresh-token','slowskinconcept@gmail.com');
 assert.notEqual(record.encrypted_refresh_token,'test-refresh-token'); assert.equal(await readRefreshToken(),'test-refresh-token');
 assert.equal(decryptToken(encryptToken('roundtrip')),'roundtrip'); assert.throws(()=>decryptToken('plaintext-token'));
 const original=process.env.TOKEN_ENCRYPTION_KEY;process.env.TOKEN_ENCRYPTION_KEY=crypto.randomBytes(32).toString('hex');
 await assert.rejects(readRefreshToken());process.env.TOKEN_ENCRYPTION_KEY=original;
 globalThis.fetch=async()=>new Response(null,{status:503});await assert.rejects(writeRefreshToken('test-refresh-token','slowskinconcept@gmail.com'));
 assert.equal(process.env.GOOGLE_REFRESH_TOKEN,originalEnv.GOOGLE_REFRESH_TOKEN);
});

test('PIN failures are counted in durable store and login enforces origin and session signature', async () => {
 const failures: any[]=[];
 globalThis.fetch=async (_url, init)=>{
  if(init?.method==='POST') {failures.push(JSON.parse(String(init.body)));return new Response(null,{status:204});}
  return Response.json(failures);
 };
 for(let i=0;i<5;i++){const res=response();await adminHandler({...req(),method:'POST',body:{pin:'wrong'}},res,'login');assert.equal(res.statusCode,401);}
 const limited=response();await adminHandler({...req(),method:'POST',body:{pin:'739251'}},limited,'login');assert.equal(limited.statusCode,429);
 const cross=response();await adminHandler({...req(),method:'POST',headers:{host:'slow-skin-concept.pl',origin:'https://attacker.example'}},cross,'login');assert.equal(cross.statusCode,403);
 failures.length=0;const valid=response();await adminHandler({...req(),method:'POST',body:{pin:'739251'}},valid,'login');assert.equal(valid.statusCode,200);
 assert.ok(session(req(valid.headers['Set-Cookie'][0].split(';')[0])));
});

test('both calendars participate and day boundaries respect summer/winter time', () => {
 assert.ok(availabilityCalendarIds().includes('slowskinconcept@gmail.com'));assert.equal(availabilityCalendarIds().length,2);
 assert.equal(warsawInstant('2026-10-19','10:00').toISOString(),'2026-10-19T08:00:00.000Z');
 assert.equal(warsawInstant('2026-10-26','10:00').toISOString(),'2026-10-26T09:00:00.000Z');
});

test('storage outage never produces available slots', async () => {
 globalThis.fetch=async()=>new Response(null,{status:503});
 const result=await getLiveAvailableSlots('2026-10-19',90);
 assert.equal(result.success,false); assert.equal(result.status,'sync_error'); assert.equal(result.googleCalendarSynced,false); assert.deepEqual(result.slots,[]);
});
