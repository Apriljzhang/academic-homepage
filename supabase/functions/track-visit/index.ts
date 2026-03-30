import { corsHeaders } from "../_shared/cors.ts";

function getClientIp(req: Request): string | null {
  // Supabase Edge Functions generally provide these via proxy/CDN.
  const candidates = [
    req.headers.get("x-forwarded-for"),
    req.headers.get("x-real-ip"),
    req.headers.get("cf-connecting-ip"),
  ].filter(Boolean) as string[];

  if (candidates.length === 0) return null;

  // x-forwarded-for may be a list.
  const first = candidates[0].split(",")[0]?.trim();
  return first || null;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type IpApiResponse = {
  country_name?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
};

async function lookupGeo(ip: string): Promise<IpApiResponse | null> {
  // No-key, best-effort lookup. If this fails, we still record an event without geo.
  const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
  const res = await fetch(url, { headers: { "User-Agent": "apriljzhang.com visits tracker" } });
  if (!res.ok) return null;
  return (await res.json()) as IpApiResponse;
}

async function insertVisit(opts: {
  ipHash: string;
  country?: string;
  region?: string;
  city?: string;
  lat?: number;
  lng?: number;
}) {
  const url = Deno.env.get("PROJECT_URL") ?? Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    throw new Error("Missing PROJECT_URL/SERVICE_ROLE_KEY (or fallback SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY)");
  }

  // Rate-limit: one event per ip_hash per day.
  const today = new Date();
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0));
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));

  const selectUrl =
    `${url}/rest/v1/visit_events?select=id&ip_hash=eq.${opts.ipHash}` +
    `&occurred_at=gte.${encodeURIComponent(start.toISOString())}` +
    `&occurred_at=lte.${encodeURIComponent(end.toISOString())}` +
    `&limit=1`;

  const headers = {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    "content-type": "application/json",
  };

  const existing = await fetch(selectUrl, { headers });
  if (existing.ok) {
    const data = (await existing.json()) as unknown[];
    if (Array.isArray(data) && data.length > 0) return { inserted: false };
  }

  const insertUrl = `${url}/rest/v1/visit_events`;
  const insertRes = await fetch(insertUrl, {
    method: "POST",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify({
      ip_hash: opts.ipHash,
      country: opts.country ?? null,
      region: opts.region ?? null,
      city: opts.city ?? null,
      lat: opts.lat ?? null,
      lng: opts.lng ?? null,
    }),
  });

  if (!insertRes.ok) {
    const txt = await insertRes.text();
    throw new Error(`Insert failed: ${insertRes.status} ${txt}`);
  }

  return { inserted: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = getClientIp(req);
    if (!ip) {
      return new Response(JSON.stringify({ ok: false, reason: "no_ip" }), {
        status: 200,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const salt = Deno.env.get("IP_HASH_SALT") ?? "change-me";
    const ipHash = await sha256Hex(`${salt}:${ip}`);

    const geo = await lookupGeo(ip);
    const result = await insertVisit({
      ipHash,
      country: geo?.country_name,
      region: geo?.region,
      city: geo?.city,
      lat: geo?.latitude,
      lng: geo?.longitude,
    });

    return new Response(JSON.stringify({ ok: true, ...result }), {
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

