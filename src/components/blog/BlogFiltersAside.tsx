import React, { useEffect, useMemo, useState } from "react";

type Post = {
  id: string;
  tags: string[];
  published_at: string;
};

type Props = {
  initialPosts?: Post[];
};

function toMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function toMonthLabel(d: Date): string {
  return `${d.getFullYear()} ${d.toLocaleDateString("en-GB", { month: "long" })}`;
}

export default function BlogFiltersAside({ initialPosts = [] }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

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
      const url =
        `${supabaseUrl}/rest/v1/blog_posts?select=id,tags,published_at` +
        `&published_at=not.is.null&published_at=lte.${encodeURIComponent(new Date().toISOString())}` +
        `&order=published_at.desc&limit=1000`;
      const res = await fetch(url, {
        headers: { apikey: supabaseAnon, authorization: `Bearer ${supabaseAnon}` },
      });
      if (!res.ok) return;
      const data = (await res.json()) as Post[];
      setPosts(data);
    })();
  }, [supabaseUrl, supabaseAnon]);

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

  const monthCounts = useMemo(() => {
    const m = new Map<string, { label: string; count: number; stamp: number }>();
    for (const p of posts) {
      const d = new Date(p.published_at);
      if (Number.isNaN(d.getTime())) continue;
      const key = toMonthKey(d);
      const existing = m.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        m.set(key, { label: toMonthLabel(d), count: 1, stamp: d.getTime() });
      }
    }
    return Array.from(m.entries())
      .sort((a, b) => b[1].stamp - a[1].stamp)
      .map(([key, v]) => ({ key, label: v.label, count: v.count }));
  }, [posts]);

  function chooseTag(tag: string) {
    setSelectedTag(tag);
    window.dispatchEvent(new CustomEvent("blog-tag-filter", { detail: { tag } }));
  }

  function chooseMonth(month: string) {
    setSelectedMonth(month);
    window.dispatchEvent(new CustomEvent("blog-month-filter", { detail: { month } }));
  }

  return (
    <nav className="space-y-6 text-sm" aria-label="Blog filters">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Blog</p>
        <ul className="flex flex-col gap-1.5">
          <li>
            <button
              type="button"
              onClick={() => chooseMonth("all")}
              className={[
                "block w-full rounded-md px-2 py-1 text-left transition-colors",
                selectedMonth === "all"
                  ? "bg-secondary-faint font-semibold text-ink"
                  : "text-muted hover:bg-neutral-hover hover:text-ink",
              ].join(" ")}
            >
              All months
            </button>
          </li>
          {monthCounts.map(({ key, label, count }) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => chooseMonth(key)}
                className={[
                  "block w-full rounded-md px-2 py-1 text-left transition-colors",
                  selectedMonth === key
                    ? "bg-secondary-faint font-semibold text-ink"
                    : "text-muted hover:bg-neutral-hover hover:text-ink",
                ].join(" ")}
                title={`${count} post${count === 1 ? "" : "s"}`}
              >
                {label} ({count})
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Tags</p>
        <ul className="flex flex-col gap-1.5">
          <li>
            <button
              type="button"
              onClick={() => chooseTag("all")}
              className={[
                "block w-full rounded-md px-2 py-1 text-left transition-colors",
                selectedTag === "all"
                  ? "bg-secondary-faint font-semibold text-ink"
                  : "text-muted hover:bg-neutral-hover hover:text-ink",
              ].join(" ")}
            >
              All ({posts.length})
            </button>
          </li>
          {tagCounts.map(({ tag, count }) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => chooseTag(tag)}
                className={[
                  "block w-full rounded-md px-2 py-1 text-left transition-colors",
                  selectedTag === tag
                    ? "bg-secondary-faint font-semibold text-ink"
                    : "text-muted hover:bg-neutral-hover hover:text-ink",
                ].join(" ")}
                title={`${count} post${count === 1 ? "" : "s"}`}
              >
                {tag} ({count})
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

