import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const allowedOrigins = new Set([
  'https://apriljzhang.com',
  'https://www.apriljzhang.com',
  'http://localhost:4321',
]);
const fixedSessionCode = 'DEDC02';

function headers(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': allowedOrigins.has(origin) ? origin : 'https://apriljzhang.com',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
    'Vary': 'Origin',
  };
}

function json(req: Request, status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: headers(req) });
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function sessionCode(value: unknown): string {
  return String(value || '').trim().toUpperCase();
}

function cleanTerm(value: unknown): string {
  const term = String(value || '').normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  return term;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: headers(req) });
  if (req.method !== 'POST') return json(req, 405, { error: 'Method not allowed' });

  const origin = req.headers.get('origin') || '';
  if (origin && !allowedOrigins.has(origin)) return json(req, 403, { error: 'Origin not allowed' });
  if (Number(req.headers.get('content-length') || 0) > 4000) return json(req, 413, { error: 'Request too large' });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
  } catch {
    return json(req, 400, { error: 'Invalid request' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return json(req, 500, { error: 'Service unavailable' });
  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const action = String(body.action || '');
  if (action === 'submit') {
    const code = sessionCode(body.sessionCode);
    if (code !== fixedSessionCode) return json(req, 400, { error: 'Use the DEDC02 student session code' });
    if (!Array.isArray(body.words) || body.words.length > 3) return json(req, 400, { error: 'Enter up to three words' });
    const terms = body.words.map(cleanTerm).filter(Boolean);
    if (!terms.length || terms.some((term) => term.length > 40 || /(?:https?:\/\/|www\.|@)/i.test(term))) {
      return json(req, 400, { error: 'Use short words or phrases; do not include names, links or email addresses' });
    }
    const { data: session, error: sessionError } = await db.from('dedc02_ethics_cloud_sessions')
      .select('session_code,expires_at').eq('session_code', code).maybeSingle();
    if (sessionError) return json(req, 500, { error: 'Could not check session' });
    if (!session || new Date(session.expires_at).getTime() <= Date.now()) {
      return json(req, 404, { error: 'Session not found or expired' });
    }
    const { count, error: countError } = await db.from('dedc02_ethics_cloud_words')
      .select('id', { count: 'exact', head: true }).eq('session_code', code);
    if (countError) return json(req, 500, { error: 'Could not check session capacity' });
    if ((count || 0) + terms.length > 600) return json(req, 429, { error: 'This cloud has reached its response limit' });
    const { error } = await db.from('dedc02_ethics_cloud_words')
      .insert(terms.map((term) => ({ session_code: code, term })));
    if (error) return json(req, 500, { error: 'Could not save words' });
    return json(req, 201, { ok: true, accepted: terms.length });
  }

  if (action !== 'create' && action !== 'results') return json(req, 400, { error: 'Unknown action' });
  const accessCode = String(body.accessCode || '').trim().toUpperCase();
  if (!/^[A-HJ-NP-Z2-9]{10}$/.test(accessCode)) return json(req, 401, { error: 'Presenter code not recognised' });
  const codeHash = await sha256(accessCode);
  const { data: key, error: keyError } = await db.from('dedc02_dashboard_keys')
    .select('key_name').eq('key_name', 'ethics_wordcloud').eq('code_hash', codeHash).maybeSingle();
  if (keyError || !key) return json(req, 401, { error: 'Presenter code not recognised' });

  if (action === 'create') {
    const { data: existing, error: lookupError } = await db.from('dedc02_ethics_cloud_sessions')
      .select('expires_at').eq('session_code', fixedSessionCode).maybeSingle();
    if (lookupError) return json(req, 500, { error: 'Could not check session' });
    if (existing && new Date(existing.expires_at).getTime() <= Date.now()) {
      const { error: clearError } = await db.from('dedc02_ethics_cloud_words')
        .delete().eq('session_code', fixedSessionCode);
      if (clearError) return json(req, 500, { error: 'Could not renew session' });
    }
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await db.from('dedc02_ethics_cloud_sessions')
      .upsert({ session_code: fixedSessionCode, expires_at: expiresAt }, { onConflict: 'session_code' })
      .select('session_code,expires_at').single();
    if (error || !data) return json(req, 500, { error: 'Could not activate DEDC02 session' });
    return json(req, 200, { sessionCode: data.session_code, expiresAt: data.expires_at });
  }

  const code = sessionCode(body.sessionCode);
  if (code !== fixedSessionCode) return json(req, 400, { error: 'Use the DEDC02 student session code' });
  const { data: session, error: sessionError } = await db.from('dedc02_ethics_cloud_sessions')
    .select('session_code,expires_at').eq('session_code', code).maybeSingle();
  if (sessionError || !session) return json(req, 404, { error: 'Session not found' });
  const { data, error } = await db.from('dedc02_ethics_cloud_words')
    .select('term').eq('session_code', code).order('created_at', { ascending: true }).limit(600);
  if (error) return json(req, 500, { error: 'Could not load words' });
  const counts = new Map<string, { term: string; count: number }>();
  for (const row of data || []) {
    const term = cleanTerm(row.term);
    const key = term.toLocaleLowerCase();
    const previous = counts.get(key);
    if (previous) previous.count += 1;
    else counts.set(key, { term, count: 1 });
  }
  const words = Array.from(counts.values()).sort((a, b) => b.count - a.count || a.term.localeCompare(b.term)).slice(0, 80);
  return json(req, 200, { words, total: data?.length || 0, sessionCode: code });
});
