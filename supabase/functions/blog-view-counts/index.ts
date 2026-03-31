import { corsHeaders } from "../_shared/cors.ts";

type Row = {
  slug: string;
  count: number;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = Deno.env.get("PROJECT_URL") ?? Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("missing_supabase_env");

    const rows: Array<{ slug: string }> = [];
    const pageSize = 1000;
    let offset = 0;
    for (;;) {
      const fetchUrl = `${url}/rest/v1/blog_visit_events?select=slug&order=occurred_at.desc&limit=${pageSize}&offset=${offset}`;
      const res = await fetch(fetchUrl, {
        headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}` },
      });
      if (!res.ok) throw new Error(`fetch_failed:${res.status}:${await res.text()}`);
      const chunk = (await res.json()) as Array<{ slug: string }>;
      rows.push(...chunk);
      if (chunk.length < pageSize) break;
      offset += pageSize;
      if (offset > 100000) break;
    }

    const map = new Map<string, number>();
    for (const r of rows) {
      if (!r.slug) continue;
      map.set(r.slug, (map.get(r.slug) ?? 0) + 1);
    }
    const data: Row[] = Array.from(map.entries()).map(([slug, count]) => ({ slug, count }));
    data.sort((a, b) => b.count - a.count);

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
