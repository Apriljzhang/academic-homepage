import React, { useEffect, useMemo, useState } from "react";

type PostItem = {
  slug: string;
  title: string;
  published_at: string;
};

type Props = {
  limit?: number;
};

export default function BlogPostAside({ limit = 8 }: Props) {
  const [posts, setPosts] = useState<PostItem[]>([]);

  const supabaseUrl = useMemo(() => {
    const u = (import.meta as any).env?.PUBLIC_SUPABASE_URL as string | undefined;
    return u?.replace(/\/$/, "") ?? "";
  }, []);
  const supabaseAnon = useMemo(() => (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY as string | undefined, []);

  const currentSlug = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("slug")?.trim() ?? "";
  }, []);

  useEffect(() => {
    (async () => {
      if (!supabaseUrl || !supabaseAnon) return;
      const url =
        `${supabaseUrl}/rest/v1/blog_posts?select=slug,title,published_at` +
        `&published_at=not.is.null&published_at=lte.${encodeURIComponent(new Date().toISOString())}` +
        `&order=published_at.desc&limit=${Math.max(1, limit + 1)}`;
      const res = await fetch(url, {
        headers: { apikey: supabaseAnon, authorization: `Bearer ${supabaseAnon}` },
      });
      if (!res.ok) return;
      const data = (await res.json()) as PostItem[];
      setPosts(data);
    })();
  }, [supabaseUrl, supabaseAnon, limit]);

  const visible = posts.filter((p) => p.slug !== currentSlug).slice(0, limit);

  return (
    <div className="text-sm text-muted">
      <p className="text-xs font-bold uppercase tracking-wider text-muted">Other posts</p>
      {visible.length === 0 ? (
        <p className="mt-3">No other posts yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {visible.map((p) => (
            <li key={p.slug}>
              <a href={`/blog/post/?slug=${encodeURIComponent(p.slug)}`} className="text-sm font-semibold text-primary no-underline hover:underline">
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
