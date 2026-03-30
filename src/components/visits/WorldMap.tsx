import React, { useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DottedMap from "dotted-map";

export type VisitDot = {
  lat: number;
  lng: number;
  label: string;
  count: number;
};

type Props = {
  dots: VisitDot[];
  lineColor?: string;
};

function projectPoint(lat: number, lng: number) {
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
}

export default function WorldMap({ dots, lineColor = "#659dbd" }: Props) {
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
          </defs>

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
      <AnimatePresence />
    </div>
  );
}

