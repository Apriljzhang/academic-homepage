import React, { useEffect, useMemo, useState } from "react";

type Props = {
  /** Redirect destination for editing page */
  adminHref?: string;
  /** Simple password required to redirect (per user request) */
  password?: string;
  /** Published posts for rendering edit buttons after unlock */
  posts?: Array<{ slug: string; title: string; published_at: string }>;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function BlogCalendarGate({ adminHref = "/blog/admin/", password = "199044", posts = [] }: Props) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [postDates, setPostDates] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState<string>("");
  const [unlocked, setUnlocked] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const supabaseUrl = useMemo(() => {
    const u = (import.meta as any).env?.PUBLIC_SUPABASE_URL as string | undefined;
    return u?.replace(/\/$/, "") ?? "";
  }, []);
  const supabaseAnon = useMemo(() => (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY as string | undefined, []);

  useEffect(() => {
    (async () => {
      if (!supabaseUrl || !supabaseAnon) return;
      const url =
        `${supabaseUrl}/rest/v1/blog_posts?select=published_at` +
        `&published_at=not.is.null&order=published_at.desc&limit=300`;
      const res = await fetch(url, {
        headers: { apikey: supabaseAnon, authorization: `Bearer ${supabaseAnon}` },
      });
      if (!res.ok) return;
      const rows = (await res.json()) as Array<{ published_at: string }>;
      const s = new Set<string>();
      for (const r of rows) {
        const d = new Date(r.published_at);
        if (Number.isNaN(d.getTime())) continue;
        s.add(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`);
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

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="font-serif text-xl font-semibold text-ink">Calendar</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMonthOffset((x) => x - 1)}
              className="rounded-full border border-border bg-page px-3 py-1.5 text-xs font-semibold text-ink hover:bg-neutral-hover"
              aria-label="Previous month"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setMonthOffset((x) => (x === 0 ? 0 : x + 1))}
              className="rounded-full border border-border bg-page px-3 py-1.5 text-xs font-semibold text-ink hover:bg-neutral-hover"
              aria-label="Next month"
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
            const key = `${cal.year}-${pad2(cal.month + 1)}-${pad2(c.day)}`;
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
        <p className="mt-4 text-xs text-muted">Highlighted dates have published posts.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="font-serif text-xl font-semibold text-ink">Tools</p>
          <button
            type="button"
            className="rounded-full border border-border bg-page px-3 py-1.5 text-xs font-semibold text-muted hover:bg-neutral-hover hover:text-ink"
            onClick={() => setShowAdmin((x) => !x)}
          >
            {showAdmin ? "Hide admin" : "Admin"}
          </button>
        </div>

        {showAdmin ? (
          <div className="mt-4">
            <p className="text-sm text-muted">Enter the password to unlock editing.</p>
            <div className="mt-3 flex gap-2">
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-md border border-border bg-page px-3 py-2 text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary hover:text-ink"
                onClick={() => {
                  if (input.trim() !== password) {
                    setMsg("Incorrect password.");
                    return;
                  }
                  try {
                    window.sessionStorage.setItem("BLOG_ADMIN_KEY", password);
                  } catch {}
                  setUnlocked(true);
                  setMsg("");
                }}
              >
                Unlock
              </button>
            </div>
            {msg ? <p className="mt-3 text-sm text-muted">{msg}</p> : null}

            {unlocked ? (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Edit published posts</p>
                <div className="mt-3 space-y-2">
                  <a
                    className="inline-flex w-full items-center justify-center rounded-full border border-border bg-page px-4 py-2 text-sm font-semibold text-ink hover:bg-neutral-hover no-underline"
                    href={adminHref}
                  >
                    New post
                  </a>

                  {posts.length === 0 ? (
                    <p className="text-sm text-muted">No published posts yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {posts.map((p) => (
                        <div key={p.slug} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-page px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">{p.title}</p>
                            <p className="text-xs text-muted">
                              {new Date(p.published_at).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" })}
                            </p>
                          </div>
                          <a
                            className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-secondary hover:text-ink no-underline"
                            href={`${adminHref}?slug=${encodeURIComponent(p.slug)}`}
                          >
                            Edit
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted">Admin tools are hidden by default.</p>
        )}
      </div>
    </div>
  );
}

