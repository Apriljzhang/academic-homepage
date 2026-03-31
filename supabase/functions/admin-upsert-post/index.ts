import { corsHeaders } from "../_shared/cors.ts";

type UpsertPayload = {
  title: string;
  slug: string;
  original_slug?: string | null;
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

    const url = Deno.env.get("PROJECT_URL") ?? Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("missing_supabase_env");

    const headers = {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
      Prefer: "return=representation",
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

    let res: Response;
    // Editing existing post: update only that row (do not overwrite unrelated rows).
    if (payload.original_slug && payload.original_slug.trim().length > 0) {
      const original = encodeURIComponent(payload.original_slug.trim());
      const updateUrl = `${url}/rest/v1/blog_posts?slug=eq.${original}`;
      res = await fetch(updateUrl, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      });
    } else {
      // New publish: insert a new row. Duplicate slug returns an error instead of overwriting.
      const insertUrl = `${url}/rest/v1/blog_posts`;
      res = await fetch(insertUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    }

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

