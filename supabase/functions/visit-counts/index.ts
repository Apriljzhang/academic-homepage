import { corsHeaders } from "../_shared/cors.ts";

type Row = {
  country: string | null;
  region: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  count: number;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("missing_supabase_env");

    // Aggregate in SQL via RPC-like REST call to PostgREST is non-trivial; use a SQL view in production.
    // Here we do a lightweight approach: fetch recent rows (max_rows=1000) and aggregate in function.
    // For higher traffic, replace with a database view + service-role select.
    const sinceDays = 30;
    const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();

    const fetchUrl =
      `${url}/rest/v1/visit_events?select=country,region,city,lat,lng,occurred_at` +
      `&occurred_at=gte.${encodeURIComponent(since)}` +
      `&limit=1000`;

    const res = await fetch(fetchUrl, {
      headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}` },
    });
    if (!res.ok) throw new Error(`fetch_failed:${res.status}:${await res.text()}`);
    const rows = (await res.json()) as Array<{
      country: string | null;
      region: string | null;
      city: string | null;
      lat: number | null;
      lng: number | null;
    }>;

    const map = new Map<string, Row>();
    for (const r of rows) {
      const key = [r.country ?? "", r.region ?? "", r.city ?? ""].join("|");
      const existing = map.get(key);
      if (!existing) {
        map.set(key, { ...r, count: 1 } as Row);
      } else {
        existing.count += 1;
      }
    }

    const data = Array.from(map.values()).sort((a, b) => b.count - a.count);
    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});

