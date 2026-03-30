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

  const supabaseUrl = useMemo(() => {
    const u = (import.meta as any).env?.PUBLIC_SUPABASE_URL as string | undefined;
    return u?.replace(/\/$/, "") ?? "";
  }, []);
  const supabaseAnon = useMemo(
    () => (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY as string | undefined,
    [],
  );

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
        <div className="mb-4 flex items-center justify-end">
          <a
            href="/blog/admin/"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-secondary hover:text-ink"
          >
            New post
          </a>
        </div>
      ) : null}

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <p className="text-sm text-muted">
            {status === "loading" ? "Loading…" : "No published posts yet."}
          </p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="border-l-4 border-primary pl-4">
              <div className="flex items-start justify-between gap-3">
                <a href={`/blog/${p.slug}/`} className="min-w-0 no-underline">
                  <p className="text-pretty text-base font-semibold text-ink sm:text-lg">{p.title}</p>
                </a>

                {isAdmin ? (
                  <a
                    href={`/blog/admin/?slug=${encodeURIComponent(p.slug)}`}
                    className="shrink-0 rounded-full border border-border bg-page px-3 py-1 text-xs font-semibold text-muted no-underline hover:bg-neutral-hover hover:text-ink"
                  >
                    Edit
                  </a>
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
    </div>
  );
}

