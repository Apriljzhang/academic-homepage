import { corsHeaders } from "../_shared/cors.ts";

function getClientIp(req: Request): string | null {
  const candidates = [
    req.headers.get("x-forwarded-for"),
    req.headers.get("x-real-ip"),
    req.headers.get("cf-connecting-ip"),
  ].filter(Boolean) as string[];
  if (candidates.length === 0) return null;
  return candidates[0].split(",")[0]?.trim() || null;
}

function parseHost(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

function parseCsvEnv(name: string): string[] {
  return (Deno.env.get(name) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

type IpApiResponse = {
  asn?: string;
  org?: string;
  asn_org?: string;
};

async function lookupGeo(ip: string): Promise<IpApiResponse | null> {
  const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "apriljzhang.com blog visits tracker" } });
    if (!res.ok) return null;
    return (await res.json()) as IpApiResponse;
  } catch {
    return null;
  }
}

function isAllowedHost(host: string | null, allowedHosts: string[]): boolean {
  if (!host) return false;
  return allowedHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

function isPrivateOrReservedIp(ip: string): boolean {
  const raw = ip.trim();
  const lower = raw.toLowerCase();
  if (!raw) return true;
  if (lower === "localhost" || lower === "::1") return true;
  if (raw.startsWith("fc") || raw.startsWith("fd")) return true;
  const m = raw.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a >= 224) return true;
  return false;
}

function isLikelyBotUserAgent(ua: string): boolean {
  const s = ua.toLowerCase();
  const botHints = ["bot", "spider", "crawler", "headless", "lighthouse", "pagespeed", "curl/", "wget/"];
  return botHints.some((h) => s.includes(h));
}

function looksLikeBrowserUa(ua: string): boolean {
  const s = ua.toLowerCase();
  const browserHints = ["mozilla/", "applewebkit/", "chrome/", "safari/", "firefox/", "edg/", "crios/", "fxios/"];
  return browserHints.some((h) => s.includes(h));
}

function hasHumanSignalHeaders(req: Request): boolean {
  const secFetchSite = req.headers.get("sec-fetch-site")?.trim();
  const secFetchMode = req.headers.get("sec-fetch-mode")?.trim();
  const secFetchDest = req.headers.get("sec-fetch-dest")?.trim();
  return Boolean(secFetchSite && secFetchMode && secFetchDest);
}

function isDeniedDataCenterOrg(geo: IpApiResponse | null): boolean {
  const source = `${geo?.org ?? ""} ${geo?.asn_org ?? ""}`.toLowerCase();
  if (!source.trim()) return false;
  const configured = parseCsvEnv("VISIT_DENYLIST_ORG_PATTERNS").map((s) => s.toLowerCase());
  const defaults = [
    "amazon",
    "aws",
    "google cloud",
    "microsoft",
    "azure",
    "digitalocean",
    "linode",
    "vultr",
    "oracle cloud",
    "cloudflare",
    "fastly",
    "akamai",
    "tencent cloud",
    "alibaba cloud",
    "hetzner",
    "ovh",
    "choopa",
    "scaleway",
  ];
  const patterns = configured.length > 0 ? configured : defaults;
  return patterns.some((p) => source.includes(p));
}

function isDeniedAsn(geo: IpApiResponse | null): boolean {
  const asn = (geo?.asn ?? "").toUpperCase().trim();
  if (!asn) return false;
  const denied = new Set(parseCsvEnv("VISIT_DENYLIST_ASNS").map((s) => s.toUpperCase()));
  return denied.has(asn);
}

function shouldIgnore(req: Request, ip: string, geo: IpApiResponse | null): string | null {
  if (isPrivateOrReservedIp(ip)) return "private_or_reserved_ip";
  const excludedIps = parseCsvEnv("VISIT_EXCLUDED_IPS");
  if (excludedIps.includes(ip.trim())) return "excluded_ip";

  const ua = req.headers.get("user-agent")?.trim() ?? "";
  if (!ua) return "missing_ua";
  if (isLikelyBotUserAgent(ua)) return "bot_ua";
  if (!looksLikeBrowserUa(ua)) return "non_browser_ua";
  if (!hasHumanSignalHeaders(req)) return "missing_human_headers";
  if (isDeniedDataCenterOrg(geo)) return "denylisted_org";
  if (isDeniedAsn(geo)) return "denylisted_asn";

  const defaultHosts = ["apriljzhang.com", "www.apriljzhang.com", "localhost"];
  const configuredHosts = parseCsvEnv("VISIT_ALLOWED_HOSTS").map((s) => s.toLowerCase());
  const allowedHosts = configuredHosts.length > 0 ? configuredHosts : defaultHosts;
  const originHost = parseHost(req.headers.get("origin"));
  const refererHost = parseHost(req.headers.get("referer"));
  if (!isAllowedHost(originHost, allowedHosts) && !isAllowedHost(refererHost, allowedHosts)) {
    return "foreign_or_missing_origin";
  }
  return null;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const body = (await req.json().catch(() => ({}))) as { slug?: string };
    const slug = body.slug?.trim();
    if (!slug) {
      return new Response(JSON.stringify({ ok: false, error: "missing_slug" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const ip = getClientIp(req);
    if (!ip) {
      return new Response(JSON.stringify({ ok: true, inserted: false, reason: "no_ip" }), {
        status: 200,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const geo = await lookupGeo(ip);
    const ignoreReason = shouldIgnore(req, ip, geo);
    if (ignoreReason) {
      return new Response(JSON.stringify({ ok: true, inserted: false, reason: ignoreReason }), {
        status: 200,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const url = Deno.env.get("PROJECT_URL") ?? Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("missing_supabase_env");

    const salt = Deno.env.get("IP_HASH_SALT") ?? "change-me";
    const ipHash = await sha256Hex(`${salt}:${ip}`);

    const today = new Date();
    const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0));
    const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));

    const headers = {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
    };

    const existsUrl =
      `${url}/rest/v1/blog_visit_events?select=id&slug=eq.${encodeURIComponent(slug)}&ip_hash=eq.${ipHash}` +
      `&occurred_at=gte.${encodeURIComponent(start.toISOString())}&occurred_at=lte.${encodeURIComponent(end.toISOString())}&limit=1`;
    const existsRes = await fetch(existsUrl, { headers });
    if (existsRes.ok) {
      const data = (await existsRes.json()) as unknown[];
      if (Array.isArray(data) && data.length > 0) {
        return new Response(JSON.stringify({ ok: true, inserted: false }), {
          status: 200,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
    }

    const insertRes = await fetch(`${url}/rest/v1/blog_visit_events`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ slug, ip_hash: ipHash }),
    });
    if (!insertRes.ok) throw new Error(`insert_failed:${insertRes.status}:${await insertRes.text()}`);

    return new Response(JSON.stringify({ ok: true, inserted: true }), {
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
