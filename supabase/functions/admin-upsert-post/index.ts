import { corsHeaders } from "../_shared/cors.ts";

type UpsertPayload = {
  title: string;
  slug: string;
  excerpt?: string;
  content_md: string;
  published_at?: string | null;
  tags?: string[];
  cover_image_url?: string | null;
};

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

    const payload = (await req.json()) as UpsertPayload;
    if (!payload?.title || !payload?.slug || !payload?.content_md) {
      return new Response(JSON.stringify({ ok: false, error: "missing_fields" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("missing_supabase_env");

    const upsertUrl = `${url}/rest/v1/blog_posts?on_conflict=slug`;
    const headers = {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
      Prefer: "return=representation,resolution=merge-duplicates",
    };

    const body = {
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt ?? null,
      content_md: payload.content_md,
      published_at: payload.published_at ?? null,
      tags: payload.tags ?? [],
      cover_image_url: payload.cover_image_url ?? null,
    };

    const res = await fetch(upsertUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`upsert_failed:${res.status}:${txt}`);
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

