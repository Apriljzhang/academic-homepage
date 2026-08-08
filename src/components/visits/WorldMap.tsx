import React, { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import DottedMap from "dotted-map";

export type VisitDot = {
  lat: number;
  lng: number;
  label: string;
  count: number;
};

export type Route = {
  start: { lat: number; lng: number; label?: string };
  end: { lat: number; lng: number; label?: string };
};

export type HomeDot = {
  lat: number;
  lng: number;
  label?: string;
};

type Props = {
  dots: VisitDot[];
  routes?: Route[];
  home?: HomeDot;
  visitorColor?: string;
  collaboratorColor?: string;
  homeColor?: string;
};

function createCurvedPath(start: { x: number; y: number }, end: { x: number; y: number }, h: number) {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - h * 0.08;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}

export default function WorldMap({
  dots,
  routes = [],
  home,
  visitorColor = "var(--color-visitor)",
  collaboratorColor = "var(--color-coral)",
  homeColor = "var(--color-forest)",
}: Props) {
  const reduceMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const { svgMap, projected, viewBox } = useMemo(() => {
    // Use dotted-map's own projection (mercator by default) for accurate pin placement.
    const baseMap = new DottedMap({ height: 100, grid: "diagonal" });
    const svg = baseMap.getSVG({
      radius: 0.22,
      color: "var(--color-forest)",
      shape: "circle",
      backgroundColor: "transparent",
    });
    const vb = svg.match(/viewBox=\"([^"]+)\"/);
    const parts = vb?.[1]?.split(" ").map((x) => Number(x)) ?? [0, 0, 198, 100];
    const w = Number.isFinite(parts[2]) ? parts[2] : 198;
    const h = Number.isFinite(parts[3]) ? parts[3] : 100;

    const projector = new DottedMap({ height: 100, grid: "diagonal" });
    const keyById = new Map<string, { kind: "dot" | "route-start" | "route-end" | "home"; idx: number }>();

    dots.forEach((d, i) => {
      const id = `dot-${i}`;
      keyById.set(id, { kind: "dot", idx: i });
      projector.addPin({ lat: d.lat, lng: d.lng, data: { id } });
    });
    routes.forEach((r, i) => {
      const sid = `route-start-${i}`;
      const eid = `route-end-${i}`;
      keyById.set(sid, { kind: "route-start", idx: i });
      keyById.set(eid, { kind: "route-end", idx: i });
      projector.addPin({ lat: r.start.lat, lng: r.start.lng, data: { id: sid } });
      projector.addPin({ lat: r.end.lat, lng: r.end.lng, data: { id: eid } });
    });
    if (home) {
      keyById.set("home", { kind: "home", idx: 0 });
      projector.addPin({ lat: home.lat, lng: home.lng, data: { id: "home" } });
    }

    const points = projector.getPoints();
    const out = {
      dots: [] as Array<{ x: number; y: number; dot: VisitDot }>,
      routeStarts: [] as Array<{ x: number; y: number; route: Route } | undefined>,
      routeEnds: [] as Array<{ x: number; y: number; route: Route } | undefined>,
      home: undefined as undefined | { x: number; y: number },
    };
    out.routeStarts = new Array(routes.length);
    out.routeEnds = new Array(routes.length);

    for (const p of points) {
      const id = p.data?.id as string | undefined;
      if (!id) continue;
      const m = keyById.get(id);
      if (!m) continue;
      if (m.kind === "dot") out.dots.push({ x: p.x, y: p.y, dot: dots[m.idx] });
      // Index by route id so start/end stay paired (getPoints() order is not reliable).
      if (m.kind === "route-start") out.routeStarts[m.idx] = { x: p.x, y: p.y, route: routes[m.idx] };
      if (m.kind === "route-end") out.routeEnds[m.idx] = { x: p.x, y: p.y, route: routes[m.idx] };
      if (m.kind === "home") out.home = { x: p.x, y: p.y };
    }

    return { svgMap: svg, projected: out, viewBox: { w, h } };
  }, [dots, routes, home]);

  function clampTranslate(scale: number, tx: number, ty: number, width: number, height: number) {
    if (scale <= 1) return { tx: 0, ty: 0 };
    const minTx = width - width * scale;
    const minTy = height - height * scale;
    return {
      tx: Math.max(minTx, Math.min(0, tx)),
      ty: Math.max(minTy, Math.min(0, ty)),
    };
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        onWheel={(e) => {
          e.preventDefault();
          const container = containerRef.current;
          if (!container) return;
          const rect = container.getBoundingClientRect();
          const pointerX = e.clientX - rect.left;
          const pointerY = e.clientY - rect.top;
          const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

          setView((v) => {
            const nextScale = Math.min(8, Math.max(1, Number((v.scale * zoomFactor).toFixed(3))));
            const contentX = (pointerX - v.tx) / v.scale;
            const contentY = (pointerY - v.ty) / v.scale;
            let nextTx = pointerX - contentX * nextScale;
            let nextTy = pointerY - contentY * nextScale;
            const clamped = clampTranslate(nextScale, nextTx, nextTy, rect.width, rect.height);
            nextTx = clamped.tx;
            nextTy = clamped.ty;
            return { scale: nextScale, tx: nextTx, ty: nextTy };
          });
        }}
        onMouseDown={(e) => {
          if (view.scale <= 1) return;
          setIsPanning(true);
          panStartRef.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
        }}
        onMouseMove={(e) => {
          if (!isPanning || !panStartRef.current || !containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const dx = e.clientX - panStartRef.current.x;
          const dy = e.clientY - panStartRef.current.y;
          const tx = panStartRef.current.tx + dx;
          const ty = panStartRef.current.ty + dy;
          const clamped = clampTranslate(view.scale, tx, ty, rect.width, rect.height);
          setView((v) => ({ ...v, tx: clamped.tx, ty: clamped.ty }));
        }}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
        style={{ cursor: view.scale > 1 ? (isPanning ? "grabbing" : "grab") : "default" }}
      >
        <div
          className="origin-top-left"
          style={{
            transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`,
            transition: isPanning ? "none" : "transform 120ms ease-out",
          }}
        >
          <div
            className="pointer-events-none h-auto w-full select-none object-cover [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] [&_svg]:h-auto [&_svg]:w-full [&_svg_circle]:opacity-[0.18]"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: svgMap }}
          />
          <svg
            ref={svgRef}
            viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
            className="absolute inset-0 h-full w-full select-none"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="World map showing AJZ, published co-authors, and visitors"
          >
          <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-paper)" stopOpacity="0" />
              <stop offset="10%" stopColor={collaboratorColor} stopOpacity="0.9" />
              <stop offset="90%" stopColor={collaboratorColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--color-paper)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {projected.routeStarts.map((startPt, i) => {
            const endPt = projected.routeEnds[i];
            if (!startPt || !endPt) return null;
            const d = createCurvedPath(
              { x: startPt.x, y: startPt.y },
              { x: endPt.x, y: endPt.y },
              viewBox.h,
            );
            return (
              <g key={`route-${i}`}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke="url(#path-gradient)"
                  strokeWidth="0.75"
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0.6 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: reduceMotion ? 0 : 1.6, ease: "easeInOut", delay: reduceMotion ? 0 : 0.15 * i }}
                />
                <motion.circle
                  r="0.9"
                  fill={collaboratorColor}
                  initial={reduceMotion ? false : { offsetDistance: "0%", opacity: 0 }}
                  animate={reduceMotion ? { opacity: 0 } : { offsetDistance: "100%", opacity: [0, 0.95, 0] }}
                  transition={{ duration: reduceMotion ? 0 : 1.6, ease: "easeInOut", delay: reduceMotion ? 0 : 0.15 * i }}
                  style={{ offsetPath: `path('${d}')` } as any}
                />
              </g>
            );
          })}

          {projected.dots.map(({ x, y, dot }) => {
            const r = Math.min(2.0, 0.72 + Math.log2(Math.max(1, dot.count)) * 0.28);
            return (
              <g key={dot.label}>
                <motion.g
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <circle cx={x} cy={y} r={r} fill={visitorColor} opacity={0.92} />
                </motion.g>
              </g>
            );
          })}

          {/* Published co-author endpoints use diamonds, distinct from visitor circles. */}
          {projected.routeEnds.map((endPt, i) => {
            if (!endPt) return null;
            return (
              <g key={`route-endpoints-${i}`}>
                <rect
                  x={endPt.x - 0.7}
                  y={endPt.y - 0.7}
                  width="1.4"
                  height="1.4"
                  fill={collaboratorColor}
                  opacity={0.95}
                  transform={`rotate(45 ${endPt.x} ${endPt.y})`}
                />
              </g>
            );
          })}

          {/* AJZ's Macau marker uses a ring, distinct from both data series. */}
          {projected.home ? (() => {
            return (
              <g key="home-dot">
                <circle cx={projected.home.x} cy={projected.home.y} r="1.55" fill={homeColor} opacity={0.98} />
                <circle cx={projected.home.x} cy={projected.home.y} r="0.62" fill="var(--color-paper)" />
              </g>
            );
          })() : null}
          </svg>
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-page/95 px-3 py-2 text-xs font-semibold text-ink shadow-sm">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="h-3 w-3 rounded-full border-[3px] border-main bg-page" aria-hidden="true" />
            AJZ
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="h-2.5 w-2.5 rotate-45 bg-accent-purple" aria-hidden="true" />
            Published co-authors
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: visitorColor }}
              aria-hidden="true"
            />
            Visitors
          </span>
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-border bg-page/90 px-2.5 py-1 text-xs font-semibold text-ink">
          Zoom {Math.round(view.scale * 100)}%
        </div>
      </div>
    </div>
  );
}
