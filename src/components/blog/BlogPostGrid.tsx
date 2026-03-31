import React, { useEffect, useMemo, useState } from "react";
import { copyBlogCitation } from "../../utils/blogCitation";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  published_at: string;
};

type Props = {
  initialPosts?: Post[];
  countsUrl?: string;
};

function postTime(p: Post): number {
  const t = new Date(p.published_at).getTime();
  return Number.isNaN(t) ? 0 : t;
}

type CountRow = {
  slug: string;
  count: number;
};

export default function BlogPostGrid({ initialPosts = [], countsUrl = "" }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [busySlug, setBusySlug] = useState<string>("");

  const supabaseUrl = useMemo(() => {
    const u = (import.meta as any).env?.PUBLIC_SUPABASE_URL as string | undefined;
    return u?.replace(/\/$/, "") ?? "";
  }, []);
  const supabaseAnon = useMemo(
    () => (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY as string | undefined,
    [],
  );
  const functionsBase = useMemo(() => {
    const base = (import.meta as any).env?.PUBLIC_SUPABASE_FUNCTIONS_BASE_URL as string | undefined;
    if (base) return base.replace(/\/$/, "");
    const supabaseUrlEnv = (import.meta as any).env?.PUBLIC_SUPABASE_URL as string | undefined;
    const x = supabaseUrlEnv?.replace(/\/$/, "");
    return x ? `${x}/functions/v1` : "";
  }, []);

  useEffect(() => {
    (async () => {
      if (!supabaseUrl || !supabaseAnon) {
        if (initialPosts.length === 0) setStatus("error");
        return;
      }
      setStatus("loading");
      try {
        const all: Post[] = [];
        const pageSize = 200;
        let offset = 0;
        for (;;) {
          const url =
            `${supabaseUrl}/rest/v1/blog_posts?select=id,slug,title,excerpt,cover_image_url,tags,published_at` +
            `&published_at=not.is.null&published_at=lte.${encodeURIComponent(new Date().toISOString())}` +
            `&order=published_at.desc&limit=${pageSize}&offset=${offset}`;
          const res = await fetch(url, {
            headers: { apikey: supabaseAnon, authorization: `Bearer ${supabaseAnon}` },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const chunk = (await res.json()) as Post[];
          all.push(...chunk);
          if (chunk.length < pageSize) break;
          offset += pageSize;
          if (offset > 10000) break;
        }
        setPosts(all.sort((a, b) => postTime(b) - postTime(a)));
        setStatus("idle");
      } catch {
        setStatus("error");
      }
    })();
  }, [supabaseUrl, supabaseAnon, initialPosts.length]);

  useEffect(() => {
    (async () => {
      if (!countsUrl) return;
      try {
        const res = await fetch(countsUrl, { headers: { accept: "application/json" } });
        if (!res.ok) return;
        const json = (await res.json()) as { ok: boolean; data?: CountRow[] };
        if (!json.ok || !Array.isArray(json.data)) return;
        const next: Record<string, number> = {};
        for (const row of json.data) {
          if (!row?.slug) continue;
          next[row.slug] = Number.isFinite(row.count) ? row.count : 0;
        }
        setViewCounts(next);
      } catch {
        // Non-fatal: cards render without counts.
      }
    })();
  }, [countsUrl]);

  useEffect(() => {
    try {
      const key = (window.sessionStorage.getItem("BLOG_ADMIN_KEY") ?? "").trim();
      setAdminKey(key);
      setIsAdmin(key.length > 0);
    } catch {
      setAdminKey("");
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const onDateFilter = (ev: Event) => {
      const e = ev as CustomEvent<{ date?: string }>;
      setSelectedDate(e.detail?.date ?? "");
    };
    window.addEventListener("blog-date-filter", onDateFilter as EventListener);
    return () => window.removeEventListener("blog-date-filter", onDateFilter as EventListener);
  }, []);
  useEffect(() => {
    const onTagFilter = (ev: Event) => {
      const e = ev as CustomEvent<{ tag?: string }>;
      setSelectedTag(e.detail?.tag ?? "all");
    };
    window.addEventListener("blog-tag-filter", onTagFilter as EventListener);
    return () => window.removeEventListener("blog-tag-filter", onTagFilter as EventListener);
  }, []);
  useEffect(() => {
    const onMonthFilter = (ev: Event) => {
      const e = ev as CustomEvent<{ month?: string }>;
      setSelectedMonth(e.detail?.month ?? "all");
    };
    window.addEventListener("blog-month-filter", onMonthFilter as EventListener);
    return () => window.removeEventListener("blog-month-filter", onMonthFilter as EventListener);
  }, []);

  const filtered = useMemo(() => {
    let arr = posts;
    if (selectedTag !== "all") {
      arr = arr.filter((p) => (p.tags ?? []).includes(selectedTag));
    }
    if (selectedMonth !== "all") {
      arr = arr.filter((p) => {
        const d = new Date(p.published_at);
        if (Number.isNaN(d.getTime())) return false;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return key === selectedMonth;
      });
    }
    if (selectedDate) {
      arr = arr.filter((p) => {
        const d = new Date(p.published_at);
        if (Number.isNaN(d.getTime())) return false;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        return key === selectedDate;
      });
    }
    return [...arr].sort((a, b) => postTime(b) - postTime(a));
  }, [posts, selectedTag, selectedMonth, selectedDate]);

  async function deletePost(slug: string) {
    const ok = window.confirm("Delete this post permanently?");
    if (!ok) return;

    let adminKey = "";
    try {
      adminKey = (window.sessionStorage.getItem("BLOG_ADMIN_KEY") ?? "").trim();
    } catch {}
    if (!adminKey) {
      window.alert("Missing admin key. Please unlock admin mode again.");
      return;
    }
    if (!functionsBase) {
      window.alert("Missing Supabase functions URL.");
      return;
    }

    setBusySlug(slug);
    try {
      const res = await fetch(`${functionsBase}/admin-delete-post`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        const msg = data?.error ?? `HTTP ${res.status}`;
        window.alert(`Delete failed: ${msg}`);
        return;
      }
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } finally {
      setBusySlug("");
    }
  }

  return (
    <div className="w-full">
      {status === "error" ? (
        <p className="text-sm text-muted">
          Could not load posts right now. If you are viewing a test build, ensure{" "}
          <code className="rounded bg-page px-1.5 py-0.5">PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-page px-1.5 py-0.5">PUBLIC_SUPABASE_ANON_KEY</code> are set for that environment.
        </p>
      ) : null}

      {isAdmin ? (
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-full border border-border bg-page px-4 py-2 text-sm font-semibold text-muted hover:bg-neutral-hover hover:text-ink"
            onClick={() => {
              try {
                window.sessionStorage.removeItem("BLOG_ADMIN_KEY");
              } catch {}
              setIsAdmin(false);
              // Refresh to hide edit controls everywhere.
              window.location.href = "/blog/";
            }}
          >
            Exit admin mode
          </button>
          <a
            href="/blog/admin/"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-secondary hover:text-ink"
          >
            New post
          </a>
        </div>
      ) : null}

      {selectedDate ? (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2 text-sm">
          <p className="text-muted">
            Filtering posts on{" "}
            <span className="font-semibold text-ink">
              {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}
            </span>
          </p>
          <button
            type="button"
            className="rounded-full border border-border bg-page px-3 py-1 text-xs font-semibold text-muted hover:bg-neutral-hover hover:text-ink"
            onClick={() => setSelectedDate("")}
          >
            Clear date
          </button>
        </div>
      ) : null}

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted">
            {status === "loading"
              ? "Loading…"
              : "No posts for current filters."}
          </p>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="border-l-4 border-primary pl-4">
              <div className="flex items-start justify-between gap-3">
                <a href={`/blog/post/?slug=${encodeURIComponent(p.slug)}`} className="min-w-0 no-underline">
                  <p className="text-pretty text-base font-semibold text-ink sm:text-lg">{p.title}</p>
                </a>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await copyBlogCitation(p.title, p.published_at, p.slug);
                        window.alert("Citation copied via BibTeX.");
                      } catch {
                        window.alert("Could not copy citation.");
                      }
                    }}
                    className="rounded-full border border-border bg-page px-3 py-1 text-xs font-semibold text-muted hover:bg-neutral-hover hover:text-ink"
                  >
                    Cite
                  </button>
                  {isAdmin ? (
                    <>
                      <a
                        href={`/blog/admin/?slug=${encodeURIComponent(p.slug)}`}
                        className="rounded-full border border-border bg-page px-3 py-1 text-xs font-semibold text-muted no-underline hover:bg-neutral-hover hover:text-ink"
                      >
                        Edit
                      </a>
                      <button
                        type="button"
                        onClick={() => deletePost(p.slug)}
                        disabled={busySlug === p.slug}
                        className="rounded-full border border-primary/40 bg-primary-faint px-3 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {busySlug === p.slug ? "Deleting…" : "Delete"}
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                <span>
                  {new Date(p.published_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
                {p.tags?.length ? <span className="text-muted/70">·</span> : null}
                {p.tags?.length ? <span>{p.tags.slice(0, 5).join(", ")}</span> : null}
                <span className="text-muted/70">·</span>
                <span className="inline-flex min-w-7 items-center justify-center rounded-full border border-border bg-page px-2 py-0.5 text-xs font-semibold text-ink">
                  {viewCounts[p.slug] ?? 0}
                </span>
              </div>

              {p.excerpt ? <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{p.excerpt}</p> : null}
            </div>
          ))
        )}
      </div>

    </div>
  );
}

