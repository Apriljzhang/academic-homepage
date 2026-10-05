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
  if (action !== 'submit' && action !== 'results') return json(req, 400, { error: 'Unknown action' });
  const { data: session, error: sessionError } = await db.from('dedc02_ethics_cloud_sessions')
    .select('expires_at').eq('session_code', fixedSessionCode).maybeSingle();
  if (sessionError) return json(req, 500, { error: 'Could not check word cloud' });
  if (!session || new Date(session.expires_at).getTime() <= Date.now()) {
    if (session) {
      const { error: clearError } = await db.from('dedc02_ethics_cloud_words')
        .delete().eq('session_code', fixedSessionCode);
      if (clearError) return json(req, 500, { error: 'Could not renew word cloud' });
    }
    const { error: renewError } = await db.from('dedc02_ethics_cloud_sessions')
      .upsert({ session_code: fixedSessionCode, expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }, { onConflict: 'session_code' });
    if (renewError) return json(req, 500, { error: 'Could not renew word cloud' });
  }

  if (action === 'submit') {
    if (!Array.isArray(body.words) || body.words.length > 3) return json(req, 400, { error: 'Enter up to three words' });
    const terms = body.words.map(cleanTerm).filter(Boolean);
    if (!terms.length || terms.some((term) => term.length > 40 || /(?:https?:\/\/|www\.|@)/i.test(term))) {
      return json(req, 400, { error: 'Use short words or phrases; do not include names, links or email addresses' });
    }
    const { count, error: countError } = await db.from('dedc02_ethics_cloud_words')
      .select('id', { count: 'exact', head: true }).eq('session_code', fixedSessionCode);
    if (countError) return json(req, 500, { error: 'Could not check session capacity' });
    if ((count || 0) + terms.length > 600) return json(req, 429, { error: 'This cloud has reached its response limit' });
    const { error } = await db.from('dedc02_ethics_cloud_words')
      .insert(terms.map((term) => ({ session_code: fixedSessionCode, term })));
    if (error) return json(req, 500, { error: 'Could not save words' });
    return json(req, 201, { ok: true, accepted: terms.length });
  }

  const { data, error } = await db.from('dedc02_ethics_cloud_words')
    .select('term').eq('session_code', fixedSessionCode).order('created_at', { ascending: true }).limit(600);
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
  return json(req, 200, { words, total: data?.length || 0, sessionCode: fixedSessionCode });
});
