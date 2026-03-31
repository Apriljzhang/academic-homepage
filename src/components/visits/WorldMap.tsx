import React, { useMemo, useRef } from "react";
import { motion } from "framer-motion";
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
  visitorColor = "#659dbd",
  collaboratorColor = "#c9492a",
  homeColor = "#8fb791",
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const { svgMap, projected, viewBox } = useMemo(() => {
    // Use dotted-map's own projection (mercator by default) for accurate pin placement.
    const baseMap = new DottedMap({ height: 100, grid: "diagonal" });
    const svg = baseMap.getSVG({
      radius: 0.22,
      color: "#00000030",
      shape: "circle",
      backgroundColor: "white",
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
      routeStarts: [] as Array<{ x: number; y: number; route: Route }>,
      routeEnds: [] as Array<{ x: number; y: number; route: Route }>,
      home: undefined as undefined | { x: number; y: number },
    };

    for (const p of points) {
      const id = p.data?.id as string | undefined;
      if (!id) continue;
      const m = keyById.get(id);
      if (!m) continue;
      if (m.kind === "dot") out.dots.push({ x: p.x, y: p.y, dot: dots[m.idx] });
      if (m.kind === "route-start") out.routeStarts.push({ x: p.x, y: p.y, route: routes[m.idx] });
      if (m.kind === "route-end") out.routeEnds.push({ x: p.x, y: p.y, route: routes[m.idx] });
      if (m.kind === "home") out.home = { x: p.x, y: p.y };
    }

    return { svgMap: svg, projected: out, viewBox: { w, h } };
  }, [dots, routes, home]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="relative w-full">
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-auto w-full pointer-events-none select-none object-cover [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
          alt="world map"
          draggable={false}
        />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
          className="absolute inset-0 h-full w-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="10%" stopColor={collaboratorColor} stopOpacity="0.9" />
              <stop offset="90%" stopColor={collaboratorColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {projected.routeStarts.map((startPt, i) => {
            const endPt = projected.routeEnds[i];
            if (!endPt) return null;
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
                  initial={{ pathLength: 0, opacity: 0.6 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 1.6, ease: "easeInOut", delay: 0.15 * i }}
                />
                <motion.circle
                  r="0.9"
                  fill={collaboratorColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{ offsetDistance: "100%", opacity: [0, 0.95, 0] }}
                  transition={{ duration: 1.6, ease: "easeInOut", delay: 0.15 * i }}
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
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <circle cx={x} cy={y} r={r} fill={visitorColor} opacity={0.92} />
                  <circle cx={x} cy={y} r={r} fill={visitorColor} opacity={0.22}>
                    <animate attributeName="r" from={r} to={r * 1.75} dur="2.8s" begin="0s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.22" to="0" dur="2.8s" begin="0s" repeatCount="indefinite" />
                  </circle>
                </motion.g>
              </g>
            );
          })}

          {/* collaborator endpoints as dots (line color) */}
          {projected.routeEnds.map((endPt, i) => {
            return (
              <g key={`route-endpoints-${i}`}>
                <circle cx={endPt.x} cy={endPt.y} r="1.05" fill={collaboratorColor} opacity={0.95} />
              </g>
            );
          })}

          {/* home dot (Macau) */}
          {projected.home ? (() => {
            return (
              <g key="home-dot">
                <circle cx={projected.home.x} cy={projected.home.y} r="2.1" fill={homeColor} opacity={0.96} />
                <circle cx={projected.home.x} cy={projected.home.y} r="2.1" fill={homeColor} opacity={0.2}>
                  <animate attributeName="r" from="2.1" to="5.6" dur="2.8s" begin="0s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.2" to="0" dur="2.8s" begin="0s" repeatCount="indefinite" />
                </circle>
              </g>
            );
          })() : null}
        </svg>
      </div>
    </div>
  );
}

