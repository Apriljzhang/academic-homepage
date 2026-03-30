import React, { useEffect, useMemo, useState } from "react";

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
};

export default function BlogPostGrid({ initialPosts = [] }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");
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
        const url =
          `${supabaseUrl}/rest/v1/blog_posts?select=id,slug,title,excerpt,cover_image_url,tags,published_at` +
          `&published_at=not.is.null&published_at=lte.${encodeURIComponent(new Date().toISOString())}` +
          `&order=published_at.desc&limit=200`;
        const res = await fetch(url, {
          headers: { apikey: supabaseAnon, authorization: `Bearer ${supabaseAnon}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Post[];
        setPosts(data);
        setStatus("idle");
      } catch {
        setStatus("error");
      }
    })();
  }, [supabaseUrl, supabaseAnon, initialPosts.length]);

  useEffect(() => {
    try {
      setIsAdmin(window.sessionStorage.getItem("BLOG_ADMIN_KEY") === "199044");
    } catch {
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

  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of posts) {
      for (const t of p.tags ?? []) {
        const key = String(t || "").trim();
        if (!key) continue;
        m.set(key, (m.get(key) ?? 0) + 1);
      }
    }
    return Array.from(m.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const filtered = useMemo(() => {
    let arr = posts;
    if (selectedTag !== "all") {
      arr = arr.filter((p) => (p.tags ?? []).includes(selectedTag));
    }
    if (selectedDate) {
      arr = arr.filter((p) => {
        const d = new Date(p.published_at);
        if (Number.isNaN(d.getTime())) return false;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        return key === selectedDate;
      });
    }
    return arr;
  }, [posts, selectedTag, selectedDate]);

  async function deletePost(slug: string) {
    const ok = window.confirm("Delete this post permanently?");
    if (!ok) return;

    let adminKey = "";
    try {
      adminKey = window.sessionStorage.getItem("BLOG_ADMIN_KEY") ?? "";
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
              : selectedTag === "all"
                ? "No published posts yet."
                : `No posts for “${selectedTag}”.`}
          </p>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="border-l-4 border-primary pl-4">
              <div className="flex items-start justify-between gap-3">
                <a href={`/blog/${p.slug}/`} className="min-w-0 no-underline">
                  <p className="text-pretty text-base font-semibold text-ink sm:text-lg">{p.title}</p>
                </a>

                {isAdmin ? (
                  <div className="shrink-0 flex items-center gap-2">
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
                  </div>
                ) : null}
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
              </div>

              {p.excerpt ? <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{p.excerpt}</p> : null}
            </div>
          ))
        )}
      </div>

      {tagCounts.length ? (
        <div className="mt-10">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Browse by tag</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={[
                "rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                selectedTag === "all"
                  ? "border-page/40 bg-secondary text-white"
                  : "border-border bg-page text-muted hover:bg-neutral-hover hover:text-ink",
              ].join(" ")}
              onClick={() => setSelectedTag("all")}
            >
              All ({posts.length})
            </button>
            {tagCounts.map(({ tag, count }) => (
              <button
                key={tag}
                type="button"
                className={[
                  "rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                  selectedTag === tag
                    ? "border-page/40 bg-secondary text-white"
                    : "border-border bg-page text-muted hover:bg-neutral-hover hover:text-ink",
                ].join(" ")}
                onClick={() => setSelectedTag(tag)}
                title={`${count} post${count === 1 ? "" : "s"}`}
              >
                {tag} ({count})
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

