import React, { useEffect, useMemo, useState } from "react";
import WorldMap from "./WorldMap";

type CountRow = {
  country: string | null;
  region: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  count: number;
};

type Route = {
  start: { lat: number; lng: number; label?: string };
  end: { lat: number; lng: number; label?: string };
};

type Props = {
  countsUrl?: string;
  collaboratorRoutes: Route[];
  home: { lat: number; lng: number; label?: string };
};

export default function VisitsDashboard({ countsUrl = "", collaboratorRoutes, home }: Props) {
  const [rows, setRows] = useState<CountRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function load() {
    if (!countsUrl) {
      setStatus("error");
      return;
    }
    setStatus((s) => (s === "idle" ? "loading" : s));
    try {
      const res = await fetch(countsUrl, { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { ok: boolean; data?: CountRow[] };
      if (json.ok && Array.isArray(json.data)) {
        setRows(json.data);
        setStatus("idle");
        return;
      }
      throw new Error("invalid_payload");
    } catch {
      // Keep the last successful snapshot on-screen.
      setStatus((prev) => (rows.length > 0 ? "idle" : "error"));
    }
  }

  useEffect(() => {
    load();
    if (!countsUrl) return;
    const id = window.setInterval(load, 30000);
    return () => window.clearInterval(id);
  }, [countsUrl]);

  const dots = useMemo(
    () =>
      rows
        .filter((r) => typeof r.lat === "number" && typeof r.lng === "number")
        .slice(0, 80)
        .map((r) => ({
          lat: r.lat as number,
          lng: r.lng as number,
          label: [r.city, r.region, r.country].filter(Boolean).join(", ") || "Unknown",
          count: r.count,
        })),
    [rows],
  );

  const listedRows = useMemo(() => rows.slice(0, 12), [rows]);
  const totalListed = useMemo(
    () => listedRows.reduce((sum, r) => sum + (Number.isFinite(r.count) ? r.count : 0), 0),
    [listedRows],
  );

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="min-w-0">
        <WorldMap
          dots={dots}
          routes={collaboratorRoutes}
          home={home}
          visitorColor="#6fa4c2"
          collaboratorColor="#c94d2c"
          homeColor="#8fb791"
        />
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Visits (live)</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">Total</p>
            <span className="shrink-0 rounded-full border border-border bg-page px-2 py-1 text-xs font-semibold text-ink">
              {totalListed}
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">Top regions</p>
          <ol className="mt-4 space-y-2 text-sm">
            {listedRows.map((r, i) => (
              <li key={`${r.city ?? ""}-${r.region ?? ""}-${r.country ?? ""}-${i}`} className="flex items-start justify-between gap-3">
                <span className="text-ink/90">{[r.city, r.region, r.country].filter(Boolean).join(", ") || "Unknown"}</span>
                <span className="shrink-0 rounded-full border border-border bg-page px-2 py-1 text-xs font-semibold text-ink">
                  {r.count}
                </span>
              </li>
            ))}
          </ol>
          {status === "error" ? (
            <p className="mt-3 text-xs text-muted">
              Could not refresh visits right now. Check `PUBLIC_SUPABASE_VISIT_COUNTS_URL` and deployed function env vars.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
