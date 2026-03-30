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
      if (!supabaseUrl || !supabaseAnon) return;
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
  }, [supabaseUrl, supabaseAnon]);

  return (
    <div className="mt-10">
      {status === "error" ? (
        <p className="text-sm text-muted">Could not load posts right now.</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <p className="text-sm text-muted">
            {status === "loading" ? "Loading…" : "No published posts yet."}
          </p>
        ) : (
          posts.map((p) => (
            <a
              key={p.id}
              href={`/blog/${p.slug}/`}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="font-serif text-xl font-semibold text-ink">{p.title}</p>
              {p.excerpt ? <p className="mt-2 text-sm leading-relaxed text-muted">{p.excerpt}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <span>
                  {new Date(p.published_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
                {p.tags?.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border border-border bg-page px-2 py-1 text-[11px]">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}

