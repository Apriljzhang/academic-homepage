export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export function assertSupabasePublicEnv(): asserts SUPABASE_URL is string {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
  }
}

export function supabaseRestHeaders(): Record<string, string> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return {};
  return {
    apikey: SUPABASE_ANON_KEY,
    authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };
}

