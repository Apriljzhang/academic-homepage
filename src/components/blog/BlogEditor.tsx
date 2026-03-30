import React, { useEffect, useMemo, useState } from "react";
import mammoth from "mammoth/mammoth.browser";

type Props = {
  adminKey: string;
};

type UploadResult = { ok: true; publicUrl: string } | { ok: false; error: string };
type UpsertResult = { ok: true } | { ok: false; error: string };

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogEditor({ adminKey }: Props) {
  const [adminKeyLocal, setAdminKeyLocal] = useState(adminKey ?? "");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [publishedDate, setPublishedDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [fileInputsKey, setFileInputsKey] = useState<number>(0);
  const [content, setContent] = useState<string>("# New post\n\nWrite in Markdown.");
  const [status, setStatus] = useState<string>("");

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  const functionsBase = useMemo(() => {
    const base = (import.meta as any).env?.PUBLIC_SUPABASE_FUNCTIONS_BASE_URL as string | undefined;
    if (base) return base.replace(/\/$/, "");
    const supabaseUrlEnv = (import.meta as any).env?.PUBLIC_SUPABASE_URL as string | undefined;
    const supabaseUrl = supabaseUrlEnv?.replace(/\/$/, "");
    // Default Supabase Edge Functions endpoint
    return supabaseUrl ? `${supabaseUrl}/functions/v1` : "";
  }, []);

  const supabaseUrl = useMemo(() => {
    const u = (import.meta as any).env?.PUBLIC_SUPABASE_URL as string | undefined;
    return u?.replace(/\/$/, "") ?? "";
  }, []);
  const supabaseAnon = useMemo(() => (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY as string | undefined, []);

  useEffect(() => {
    if (!adminKeyLocal.trim()) {
      try {
        const stored = window.sessionStorage.getItem("BLOG_ADMIN_KEY") ?? "";
        if (stored) setAdminKeyLocal(stored);
      } catch {}
    }
    // If the editor is opened with ?slug=..., prefill from that post.
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("slug");
      if (!s) return;
      await loadPost(s);
    })().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseUrl, supabaseAnon]);

  async function loadPost(slugToLoad: string) {
    if (!supabaseUrl || !supabaseAnon) return;
    const url =
      `${supabaseUrl}/rest/v1/blog_posts?select=slug,title,content_md,cover_image_url,tags,published_at` +
      `&slug=eq.${encodeURIComponent(slugToLoad)}&limit=1`;
    const res = await fetch(url, {
      headers: { apikey: supabaseAnon, authorization: `Bearer ${supabaseAnon}` },
    });
    if (!res.ok) {
      setStatus("Could not load post.");
      return;
    }
    const data = (await res.json()) as Array<{
      slug: string;
      title: string;
      content_md: string;
      cover_image_url: string | null;
      tags: string[];
      published_at: string | null;
    }>;
    const p = data[0];
    if (!p) return;
    setTitle(p.title ?? "");
    setSlug(p.slug ?? "");
    setContent(p.content_md ?? "");
    setCoverUrl(p.cover_image_url ?? "");
    setTags((p.tags ?? []).join(", "));
    if (p.published_at) {
      const d = new Date(p.published_at);
      const yyyyMmDd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      setPublishedDate(yyyyMmDd);
    } else {
      const now = new Date();
      setPublishedDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
    }
    setStatus(`Loaded “${p.title}”. Edit and Publish / Update to save changes.`);
  }

  async function uploadCover(file: File): Promise<UploadResult> {
    if (!functionsBase) return { ok: false, error: "Missing PUBLIC_SUPABASE_URL (cannot reach functions)" };
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${functionsBase}/admin-upload-image`, {
      method: "POST",
      headers: { "x-admin-key": adminKeyLocal },
      body: fd,
    });
    const text = await res.text().catch(() => "");
    const data = (() => {
      try {
        return text ? JSON.parse(text) : null;
      } catch {
        return null;
      }
    })();
    if (!res.ok || !data?.ok) {
      const hint =
        res.status === 401
          ? " (401 usually means Supabase Function 'Verify JWT' is enabled OR ADMIN_KEY mismatch)"
          : "";
      return { ok: false, error: (data?.error ?? text ?? `HTTP ${res.status}`) + hint };
    }
    return { ok: true, publicUrl: data.publicUrl as string };
  }

  async function upsertPost(): Promise<UpsertResult> {
    if (!functionsBase) return { ok: false, error: "Missing PUBLIC_SUPABASE_URL (cannot reach functions)" };
    const iso = (() => {
      // Date-only input; store as midnight UTC for stable ordering
      const s = `${publishedDate}T00:00:00.000Z`;
      return new Date(s).toISOString();
    })();
    const payload = {
      title: title.trim(),
      slug: (slug.trim() || slugify(title)).trim(),
      content_md: content,
      published_at: iso,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      cover_image_url: coverUrl.trim() || null,
    };

    const res = await fetch(`${functionsBase}/admin-upsert-post`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-key": adminKeyLocal },
      body: JSON.stringify(payload),
    });
    const text = await res.text().catch(() => "");
    const data = (() => {
      try {
        return text ? JSON.parse(text) : null;
      } catch {
        return null;
      }
    })();
    if (!res.ok || !data?.ok) {
      const details =
        data?.error ??
        (typeof data === "string" ? data : null) ??
        text ??
        `HTTP ${res.status} ${res.statusText}`.trim();
      const hint =
        res.status === 401
          ? " (401 usually means Supabase Function 'Verify JWT' is enabled OR ADMIN_KEY mismatch)"
          : "";
      return { ok: false, error: details || "Save failed" };
    }
    return { ok: true };
  }

  return (
    <div className="w-full">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Post details</p>
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setSlug("");
                  setTags("");
                  const now = new Date();
                  setPublishedDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
                  setCoverUrl("");
                  setContent("# New post\n\nWrite in Markdown.");
                  setStatus("");
                  setFileInputsKey((x) => x + 1);
                }}
                className="rounded-full border border-border bg-page px-4 py-2 text-xs font-semibold text-ink hover:bg-neutral-hover"
              >
                New post
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Title</span>
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug) setSlug(slugify(e.target.value));
                  }}
                  className="w-full rounded-md border border-border bg-page px-3 py-2 text-sm"
                  placeholder="Post title"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Tags</span>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-md border border-border bg-page px-3 py-2 text-sm"
                  placeholder="e.g. teaching, research"
                />
              </label>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Date</span>
                <input
                  type="date"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-page px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="rounded-full border border-border bg-page px-3 py-1.5">Cover image</span>
                  <input
                    key={`cover-${fileInputsKey}`}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setStatus("Uploading cover…");
                      const r = await uploadCover(file);
                      if (!r.ok) {
                        setStatus(`Upload failed: ${r.error}`);
                        return;
                      }
                      setCoverUrl(r.publicUrl);
                      setStatus("Cover uploaded.");
                    }}
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="rounded-full border border-border bg-page px-3 py-1.5">Import Word</span>
                  <input
                    key={`word-${fileInputsKey}`}
                    type="file"
                    accept=".docx"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setStatus("Importing Word document…");
                      try {
                        const buf = await file.arrayBuffer();
                        const res = await mammoth.extractRawText({ arrayBuffer: buf });
                        const txt = (res.value || "").trim();
                        if (!txt) {
                          setStatus("No text found in the Word file.");
                          return;
                        }
                        setContent((prev) => (prev.trim() ? `${prev.trim()}\n\n${txt}\n` : `${txt}\n`));
                        setStatus("Word text imported.");
                      } catch (err) {
                        setStatus(`Word import failed: ${String(err)}`);
                      }
                    }}
                  />
                </label>
                {coverUrl ? (
                  <a className="text-sm font-semibold text-primary underline-offset-2 hover:underline" href={coverUrl} target="_blank" rel="noreferrer">
                    View cover →
                  </a>
                ) : null}
              </div>

              <button
                disabled={!canSubmit}
                onClick={async () => {
                  if (!adminKeyLocal.trim()) {
                    setStatus("Missing admin key. Open this page via the Blog admin gate so the key is included in the link.");
                    return;
                  }
                  setStatus("Saving…");
                  const r = await upsertPost();
                  setStatus(r.ok ? "Saved. Refresh /blog to see it." : `Save failed: ${r.error}`);
                }}
                className={[
                  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  canSubmit ? "bg-primary text-white hover:bg-secondary hover:text-ink" : "bg-neutral-hover text-muted cursor-not-allowed",
                ].join(" ")}
              >
                Publish / Update
              </button>
            </div>

            {status ? <p className="mt-3 text-sm text-muted">{status}</p> : null}
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Markdown</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 w-full min-h-[420px] rounded-md border border-border bg-page px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

