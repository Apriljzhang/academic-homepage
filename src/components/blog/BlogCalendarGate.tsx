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
  const [selectedDate, setSelectedDate] = useState<string>("");

  const supabaseUrl = useMemo(() => {
    const u = (import.meta as any).env?.PUBLIC_SUPABASE_URL as string | undefined;
    return u?.replace(/\/$/, "") ?? "";
  }, []);
  const supabaseAnon = useMemo(() => (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY as string | undefined, []);

  useEffect(() => {
    (async () => {
      if (!supabaseUrl || !supabaseAnon) return;
      const rows: Array<{ published_at: string }> = [];
      const pageSize = 200;
      let offset = 0;
      for (;;) {
        const url =
          `${supabaseUrl}/rest/v1/blog_posts?select=published_at` +
          `&published_at=not.is.null&order=published_at.desc&limit=${pageSize}&offset=${offset}`;
        const res = await fetch(url, {
          headers: { apikey: supabaseAnon, authorization: `Bearer ${supabaseAnon}` },
        });
        if (!res.ok) return;
        const chunk = (await res.json()) as Array<{ published_at: string }>;
        rows.push(...chunk);
        if (chunk.length < pageSize) break;
        offset += pageSize;
        if (offset > 10000) break;
      }
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
    <div className="w-full">
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
              <button
                type="button"
                key={c.key}
                className={[
                  "h-9 rounded-lg border text-sm grid place-items-center transition-colors",
                  selectedDate === key
                    ? "border-secondary/70 bg-secondary text-white"
                    : hasPost
                      ? "border-primary/40 bg-primary-faint text-ink hover:bg-primary-faint/80"
                      : "border-border bg-page text-ink/80 hover:bg-neutral-hover",
                ].join(" ")}
                title={hasPost ? "Blog post published" : ""}
                onClick={() => {
                  const next = selectedDate === key ? "" : key;
                  setSelectedDate(next);
                  window.dispatchEvent(
                    new CustomEvent("blog-date-filter", {
                      detail: { date: next },
                    }),
                  );
                }}
              >
                {c.day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

