import React, { useMemo } from "react";

export default function CutsCompletedCard() {
  const Card =
    "bg-white/10 border border-white/20 rounded-lg p-4 md:p-6 w-full max-w-xl";

  // 🧪 Fake data — change these as you like
  const completed = 37;
  const goal = 50;

  const pct = useMemo(() => {
    const p = Math.min(100, Math.round((completed / goal) * 100));
    return Number.isFinite(p) ? p : 0;
  }, [completed, goal]);

  // SVG circle math
  const size = 128;              // viewBox size
  const stroke = 10;             // stroke width
  const r = (size - stroke) / 2; // radius
  const c = 2 * Math.PI * r;     // circumference
  const dash = (pct / 100) * c;
  const gap = c - dash;

  return (
    <div className={Card}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/80 raleway-regular text-sm">Cuts Completed</p>
          <p className="text-white raleway-bold text-4xl mt-1">{completed}</p>
        </div>
        <div>
          <p className="text-white/70 text-xs text-right">Milestone</p>
          <p className="text-[#DDCA7D] raleway-bold text-lg text-right">{goal}</p>
        </div>
      </div>

      {/* Circular progress */}
      <div className="flex items-center justify-center">
        <svg
          width="180"
          height="180"
          viewBox={`0 0 ${size} ${size}`}
          className="block"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            className="text-[#DDCA7D]"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />

          {/* Center labels */}
          <g transform={`translate(${size / 2}, ${size / 2})`} textAnchor="middle">
            <text y="-4" className="fill-white raleway-bold" fontSize="24">
              {pct}%
            </text>
            <text y="18" className="fill-white/70 raleway-regular" fontSize="10">
              {completed} / {goal}
            </text>
          </g>
        </svg>
      </div>

      <p className="text-white/60 raleway-regular text-xs mt-3">
        Progress toward your monthly cuts goal.
      </p>
    </div>
  );
}
