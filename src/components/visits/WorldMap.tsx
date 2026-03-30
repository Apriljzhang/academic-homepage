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

type Props = {
  dots: VisitDot[];
  routes?: Route[];
  lineColor?: string;
};

function projectPoint(lat: number, lng: number) {
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
}

function createCurvedPath(start: { x: number; y: number }, end: { x: number; y: number }) {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 50;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}

export default function WorldMap({ dots, routes = [], lineColor = "#659dbd" }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);
  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: "#00000030",
        shape: "circle",
        backgroundColor: "white",
      }),
    [map],
  );

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
          viewBox="0 0 800 400"
          className="absolute inset-0 h-full w-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow">
              <feMorphology operator="dilate" radius="0.6" />
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="10%" stopColor={lineColor} stopOpacity="0.9" />
              <stop offset="90%" stopColor={lineColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {routes.map((r, i) => {
            const start = projectPoint(r.start.lat, r.start.lng);
            const end = projectPoint(r.end.lat, r.end.lng);
            const d = createCurvedPath(start, end);
            return (
              <g key={`route-${i}`}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke="url(#path-gradient)"
                  strokeWidth="1.2"
                  initial={{ pathLength: 0, opacity: 0.6 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 1.6, ease: "easeInOut", delay: 0.15 * i }}
                />
                <motion.circle
                  r="3.5"
                  fill={lineColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{ offsetDistance: "100%", opacity: [0, 1, 0] }}
                  transition={{ duration: 1.6, ease: "easeInOut", delay: 0.15 * i }}
                  style={{ offsetPath: `path('${d}')` } as any}
                />
              </g>
            );
          })}

          {dots.map((d) => {
            const pt = projectPoint(d.lat, d.lng);
            const r = Math.min(10, 3 + Math.log2(Math.max(1, d.count)));
            return (
              <g key={d.label}>
                <motion.g
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <circle cx={pt.x} cy={pt.y} r={r} fill={lineColor} filter="url(#glow)" opacity={0.9} />
                  <circle cx={pt.x} cy={pt.y} r={r} fill={lineColor} opacity={0.35}>
                    <animate attributeName="r" from={r} to={r * 3} dur="2.8s" begin="0s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.35" to="0" dur="2.8s" begin="0s" repeatCount="indefinite" />
                  </circle>
                </motion.g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

