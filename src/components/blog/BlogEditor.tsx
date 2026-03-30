import React, { useMemo, useState } from "react";

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
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("teaching, research");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [content, setContent] = useState<string>("# New post\n\nWrite in Markdown.");
  const [status, setStatus] = useState<string>("");

  const canSubmit = adminKey.trim().length > 0 && title.trim().length > 0 && content.trim().length > 0;

  const functionsBase = useMemo(() => {
    const base = (import.meta as any).env?.PUBLIC_SUPABASE_FUNCTIONS_BASE_URL as string | undefined;
    return base?.replace(/\/$/, "") ?? "";
  }, []);

  async function uploadCover(file: File): Promise<UploadResult> {
    if (!functionsBase) return { ok: false, error: "Missing PUBLIC_SUPABASE_FUNCTIONS_BASE_URL" };
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${functionsBase}/admin-upload-image`, {
      method: "POST",
      headers: { "x-admin-key": adminKey },
      body: fd,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) return { ok: false, error: data?.error ?? "Upload failed" };
    return { ok: true, publicUrl: data.publicUrl as string };
  }

  async function upsertPost(): Promise<UpsertResult> {
    if (!functionsBase) return { ok: false, error: "Missing PUBLIC_SUPABASE_FUNCTIONS_BASE_URL" };
    const payload = {
      title: title.trim(),
      slug: (slug.trim() || slugify(title)).trim(),
      excerpt: excerpt.trim() || null,
      content_md: content,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      cover_image_url: coverUrl.trim() || null,
    };

    const res = await fetch(`${functionsBase}/admin-upsert-post`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) return { ok: false, error: data?.error ?? "Save failed" };
    return { ok: true };
  }

  return (
    <div className="w-full">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
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
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Slug</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-md border border-border bg-page px-3 py-2 text-sm"
                  placeholder="e.g. formative-assessment-notes"
                />
              </label>
            </div>

            <label className="mt-3 block space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Excerpt</span>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full min-h-[70px] rounded-md border border-border bg-page px-3 py-2 text-sm"
                placeholder="Short description shown on the Blog list."
              />
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Tags</span>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-md border border-border bg-page px-3 py-2 text-sm"
                  placeholder="comma,separated,tags"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Publish time</span>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full rounded-md border border-border bg-page px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="rounded-full border border-border bg-page px-3 py-1.5">Cover image</span>
                  <input
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
                {coverUrl ? (
                  <a className="text-sm font-semibold text-primary underline-offset-2 hover:underline" href={coverUrl} target="_blank" rel="noreferrer">
                    View cover →
                  </a>
                ) : null}
              </div>

              <button
                disabled={!canSubmit}
                onClick={async () => {
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

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <p className="font-serif text-xl font-semibold text-ink">Setup</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <span className="font-semibold text-ink">1.</span> Deploy Supabase edge functions:{" "}
                <code className="rounded bg-page px-1.5 py-0.5">track-visit</code>,{" "}
                <code className="rounded bg-page px-1.5 py-0.5">admin-upsert-post</code>,{" "}
                <code className="rounded bg-page px-1.5 py-0.5">admin-upload-image</code>.
              </li>
              <li>
                <span className="font-semibold text-ink">2.</span> Set env vars in the website build:{" "}
                <code className="rounded bg-page px-1.5 py-0.5">PUBLIC_SUPABASE_FUNCTIONS_BASE_URL</code>
              </li>
              <li>
                <span className="font-semibold text-ink">3.</span> Open this page as{" "}
                <code className="rounded bg-page px-1.5 py-0.5">/blog/admin?key=YOUR_ADMIN_KEY</code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

