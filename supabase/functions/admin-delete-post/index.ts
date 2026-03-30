import { corsHeaders } from "../_shared/cors.ts";

function assertAdmin(req: Request) {
  const expected = Deno.env.get("ADMIN_KEY");
  const got = req.headers.get("x-admin-key");
  if (!expected || !got || got !== expected) {
    throw new Error("unauthorized");
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    assertAdmin(req);

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const payload = (await req.json()) as { slug?: string };
    const slug = (payload?.slug ?? "").trim();
    if (!slug) {
      return new Response(JSON.stringify({ ok: false, error: "missing_slug" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const url = Deno.env.get("PROJECT_URL") ?? Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("missing_supabase_env");

    const delUrl = `${url}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}`;
    const res = await fetch(delUrl, {
      method: "DELETE",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`delete_failed:${res.status}:${txt}`);
    }

    const data = await res.json();
    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    const msg = String(err);
    const status = msg.includes("unauthorized") ? 401 : 500;
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});

