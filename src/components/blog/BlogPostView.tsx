import React, { useEffect, useMemo, useState } from "react";
import { marked } from "marked";

type Post = {
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string;
  cover_image_url: string | null;
  tags: string[];
  published_at: string;
};

export default function BlogPostView() {
  const [post, setPost] = useState<Post | null>(null);
  const [status, setStatus] = useState<"loading" | "missing" | "error" | "ready">("loading");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  const supabaseUrl = useMemo(() => {
    const u = (import.meta as any).env?.PUBLIC_SUPABASE_URL as string | undefined;
    return u?.replace(/\/$/, "") ?? "";
  }, []);
  const supabaseAnon = useMemo(
    () => (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY as string | undefined,
    [],
  );

  const slug = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("slug")?.trim() ?? "";
  }, []);

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
    (async () => {
      if (!slug) {
        setStatus("missing");
        return;
      }
      if (!supabaseUrl || !supabaseAnon) {
        setStatus("error");
        return;
      }
      setStatus("loading");
      try {
        const url =
          `${supabaseUrl}/rest/v1/blog_posts?select=slug,title,excerpt,content_md,cover_image_url,tags,published_at` +
          `&slug=eq.${encodeURIComponent(slug)}&published_at=not.is.null` +
          `&published_at=lte.${encodeURIComponent(new Date().toISOString())}&limit=1`;
        const res = await fetch(url, {
          headers: { apikey: supabaseAnon, authorization: `Bearer ${supabaseAnon}` },
        });
        if (!res.ok) {
          setStatus("error");
          return;
        }
        const data = (await res.json()) as Post[];
        const p = data[0] ?? null;
        if (!p) {
          setStatus("missing");
          return;
        }
        setPost(p);
        setStatus("ready");
        document.title = `${p.title} · Blog`;
      } catch {
        setStatus("error");
      }
    })();
  }, [slug, supabaseUrl, supabaseAnon]);

  if (status === "loading") return <p className="text-sm text-muted">Loading post…</p>;
  if (status === "error") {
    return <p className="text-sm text-muted">Could not load this post right now.</p>;
  }
  if (!post || status === "missing") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">Post not found.</p>
        <a href="/blog/" className="text-sm font-semibold text-primary no-underline hover:underline">
          ← Back to Blog
        </a>
      </div>
    );
  }

  const html = marked.parse(post.content_md);
  return (
    <div>
      <a href="/blog/" className="text-sm font-semibold text-primary no-underline hover:underline">
        ← Back to Blog
      </a>
      {isAdmin ? (
        <a
          href={
            adminKey
              ? `/blog/admin/?slug=${encodeURIComponent(post.slug)}&key=${encodeURIComponent(adminKey)}`
              : `/blog/admin/?slug=${encodeURIComponent(post.slug)}`
          }
          className="ml-3 text-sm font-semibold text-muted no-underline hover:underline"
        >
          Edit
        </a>
      ) : null}

      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{post.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {new Date(post.published_at).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        })}
      </p>

      {post.cover_image_url ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <img src={post.cover_image_url} alt="" className="h-auto w-full object-cover" loading="lazy" />
        </div>
      ) : null}

      <article
        className="mt-8 max-w-none space-y-4 text-pretty text-base leading-relaxed text-ink/95"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {post.tags?.length ? (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="rounded-full border border-border bg-surface px-2 py-1 text-xs font-semibold text-ink">
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
