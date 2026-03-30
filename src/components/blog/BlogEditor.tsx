import React, { useEffect, useMemo, useState } from "react";

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
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("teaching, research");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [content, setContent] = useState<string>("# New post\n\nWrite in Markdown.");
  const [status, setStatus] = useState<string>("");
  const [monthOffset, setMonthOffset] = useState<number>(0);
  const [postDates, setPostDates] = useState<Set<string>>(new Set());

  const canSubmit =
    adminKeyLocal.trim().length > 0 && title.trim().length > 0 && content.trim().length > 0;

  const functionsBase = useMemo(() => {
    const base = (import.meta as any).env?.PUBLIC_SUPABASE_FUNCTIONS_BASE_URL as string | undefined;
    return base?.replace(/\/$/, "") ?? "";
  }, []);

  const supabaseUrl = useMemo(() => {
    const u = (import.meta as any).env?.PUBLIC_SUPABASE_URL as string | undefined;
    return u?.replace(/\/$/, "") ?? "";
  }, []);
  const supabaseAnon = useMemo(() => (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY as string | undefined, []);

  useEffect(() => {
    (async () => {
      if (!supabaseUrl || !supabaseAnon) return;
      const url =
        `${supabaseUrl}/rest/v1/blog_posts?select=slug,published_at` +
        `&published_at=not.is.null&order=published_at.desc&limit=200`;
      const res = await fetch(url, {
        headers: {
          apikey: supabaseAnon,
          authorization: `Bearer ${supabaseAnon}`,
        },
      });
      if (!res.ok) return;
      const rows = (await res.json()) as Array<{ published_at: string }>;
      const s = new Set<string>();
      for (const r of rows) {
        const d = new Date(r.published_at);
        if (Number.isNaN(d.getTime())) continue;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        s.add(key);
      }
      setPostDates(s);
    })();
  }, [supabaseUrl, supabaseAnon]);

  const cal = useMemo(() => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = first.getFullYear();
    const month = first.getMonth();
    const startDay = (first.getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ day: number | null; key: string }> = [];
    for (let i = 0; i < startDay; i++) cells.push({ day: null, key: `b${i}` });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, key: `d${d}` });
    while (cells.length % 7 !== 0) cells.push({ day: null, key: `a${cells.length}` });
    return { year, month, cells };
  }, [monthOffset]);

  async function uploadCover(file: File): Promise<UploadResult> {
    if (!functionsBase) return { ok: false, error: "Missing PUBLIC_SUPABASE_FUNCTIONS_BASE_URL" };
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${functionsBase}/admin-upload-image`, {
      method: "POST",
      headers: { "x-admin-key": adminKeyLocal },
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
      headers: { "content-type": "application/json", "x-admin-key": adminKeyLocal },
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
                  if (!adminKeyLocal.trim()) {
                    setStatus("Missing admin key. Add it in the sidebar first.");
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

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Admin key</p>
            <input
              value={adminKeyLocal}
              onChange={(e) => setAdminKeyLocal(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-page px-3 py-2 text-sm"
              placeholder="Paste your ADMIN_KEY here"
            />
            <p className="mt-2 text-xs text-muted">
              If you opened this page with <code className="rounded bg-page px-1.5 py-0.5">?key=...</code>, it will prefill automatically.
            </p>

            <div className="flex items-center justify-between gap-3">
              <p className="font-serif text-xl font-semibold text-ink">Blog calendar</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMonthOffset((x) => x - 1)}
                  className="rounded-full border border-border bg-page px-3 py-1.5 text-xs font-semibold text-ink hover:bg-neutral-hover"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setMonthOffset((x) => (x === 0 ? 0 : x + 1))}
                  className="rounded-full border border-border bg-page px-3 py-1.5 text-xs font-semibold text-ink hover:bg-neutral-hover"
                >
                  →
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted">
              {new Date(cal.year, cal.month, 1).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
            </p>

            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2 text-center text-sm">
              {cal.cells.map((c) => {
                if (!c.day) return <div key={c.key} className="h-9" />;
                const key = `${cal.year}-${String(cal.month + 1).padStart(2, "0")}-${String(c.day).padStart(2, "0")}`;
                const hasPost = postDates.has(key);
                return (
                  <div
                    key={c.key}
                    className={[
                      "h-9 rounded-lg border text-sm grid place-items-center",
                      hasPost ? "border-primary/40 bg-primary-faint text-ink" : "border-border bg-page text-ink/80",
                    ].join(" ")}
                    title={hasPost ? "Blog post published" : ""}
                  >
                    {c.day}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-muted">
              Highlighted dates have published posts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

