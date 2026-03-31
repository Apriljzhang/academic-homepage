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
    const url = Deno.env.get("PROJECT_URL") ?? Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("missing_supabase_env");

    // Aggregate in function: page through recent rows and merge counts in-memory.
    const sinceDays = 30;
    const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();
    const rows: Array<{
      country: string | null;
      region: string | null;
      city: string | null;
      lat: number | null;
      lng: number | null;
    }> = [];
    const pageSize = 500;
    let offset = 0;
    for (;;) {
      const fetchUrl =
        `${url}/rest/v1/visit_events?select=country,region,city,lat,lng,occurred_at` +
        `&occurred_at=gte.${encodeURIComponent(since)}` +
        `&order=occurred_at.desc&limit=${pageSize}&offset=${offset}`;

      const res = await fetch(fetchUrl, {
        headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}` },
      });
      if (!res.ok) throw new Error(`fetch_failed:${res.status}:${await res.text()}`);
      const chunk = (await res.json()) as Array<{
        country: string | null;
        region: string | null;
        city: string | null;
        lat: number | null;
        lng: number | null;
      }>;
      rows.push(...chunk);
      if (chunk.length < pageSize) break;
      offset += pageSize;
      if (offset > 50000) break;
    }

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

