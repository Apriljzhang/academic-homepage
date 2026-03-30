import { corsHeaders } from "../_shared/cors.ts";

function assertAdmin(req: Request) {
  const expected = Deno.env.get("ADMIN_KEY");
  const got = req.headers.get("x-admin-key");
  if (!expected || !got || got !== expected) {
    throw new Error("unauthorized");
  }
}

function safeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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

    const url = Deno.env.get("PROJECT_URL") ?? Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("missing_supabase_env");

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ ok: false, error: "missing_file" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const rawName = file.name || "image";
    const ext = rawName.includes(".") ? rawName.split(".").pop() : "bin";
    const key = `blog/${Date.now()}-${crypto.randomUUID()}-${safeFileName(rawName)}.${ext}`;

    // Ensure bucket exists on hosted project: create it in dashboard (blog-images) or via SQL.
    const uploadUrl = `${url}/storage/v1/object/blog-images/${encodeURIComponent(key)}`;
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "content-type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: file.stream(),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`upload_failed:${res.status}:${txt}`);
    }

    const publicUrl = `${url}/storage/v1/object/public/blog-images/${key}`;
    return new Response(JSON.stringify({ ok: true, key, publicUrl }), {
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

