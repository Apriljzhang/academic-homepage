import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const allowedOrigins = new Set([
  'https://apriljzhang.com',
  'https://www.apriljzhang.com',
  'http://localhost:4321',
]);

const answerKeys = [
  'ontology',
  'epistemology',
  'axiology',
  'methodology',
  'assumption',
  'alignment',
] as const;

function corsHeaders(req: Request): Record<string, string> {
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
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(req) });
}

function cleanClassCode(value: unknown): string {
  return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 40);
}

function cleanAnswers(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const answers: Record<string, string> = {};
  for (const key of answerKeys) answers[key] = String(source[key] || '').trim().slice(0, 1500);
  return Object.values(answers).some(Boolean) ? answers : null;
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });
  if (req.method !== 'POST') return json(req, 405, { error: 'Method not allowed' });

  const origin = req.headers.get('origin') || '';
  if (origin && !allowedOrigins.has(origin)) return json(req, 403, { error: 'Origin not allowed' });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(req, 400, { error: 'Invalid request' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return json(req, 500, { error: 'Service unavailable' });
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const action = String(body.action || '');
  const classCode = cleanClassCode(body.classCode);
  if (classCode.length < 2) return json(req, 400, { error: 'Enter a valid class code' });

  if (action === 'submit') {
    const preferredName = String(body.preferredName || '').trim().slice(0, 60);
    if (!preferredName) return json(req, 400, { error: 'Enter a nickname or preferred name' });
    const answers = cleanAnswers(body.answers);
    if (!answers) return json(req, 400, { error: 'Complete at least one response' });
    const { error } = await supabase.from('dedc02_exit_tickets').insert({
      class_code: classCode,
      preferred_name: preferredName,
      answers,
    });
    if (error) return json(req, 500, { error: 'Could not save the exit ticket' });
    return json(req, 201, { ok: true });
  }

  if (action === 'list') {
    const accessCode = String(body.accessCode || '').trim();
    if (accessCode.length < 24) return json(req, 401, { error: 'Teacher access code not recognised' });
    const codeHash = await sha256(accessCode);
    const { data: keyRow, error: keyError } = await supabase
      .from('dedc02_dashboard_keys')
      .select('key_name')
      .eq('key_name', 'teacher')
      .eq('code_hash', codeHash)
      .maybeSingle();
    if (keyError || !keyRow) return json(req, 401, { error: 'Teacher access code not recognised' });

    const { data, error } = await supabase
      .from('dedc02_exit_tickets')
      .select('id, class_code, preferred_name, answers, created_at')
      .eq('class_code', classCode)
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) return json(req, 500, { error: 'Could not load responses' });
    return json(req, 200, { responses: data || [] });
  }

  return json(req, 400, { error: 'Unknown action' });
});
