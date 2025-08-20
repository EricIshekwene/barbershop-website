import React, { useState, useMemo } from "react";

export default function NewUsersStats() {
  const Card =
    "bg-white/10 border border-white/20 rounded-lg p-4 md:p-6 w-full max-w-xl";

  const Pill =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn transition-all duration-300 focus:outline-none";
  const PillActive =
    "bg-[#DDCA7D] text-black shadow";
  const PillInactive =
    "bg-white/10 text-[#DDCA7D] hover:bg-white/20";

  // 🔢 Fake data (adjust however you want)
  // Keys match the control values below
  const fakeNewUsers = {
    "1m": { total: 18, weekly: [3, 5, 4, 6] },  // 4 weeks
    "2m": { total: 41, weekly: [3, 5, 4, 6, 7, 5, 4, 7] }, // 8 weeks
    "3m": { total: 64, weekly: [3, 5, 4, 6, 7, 5, 4, 7, 6, 5, 8, 4] }, // 12 weeks
  };

  const [range, setRange] = useState("1m");

  const { total, weekly } = useMemo(() => fakeNewUsers[range], [range]);

  // A tiny helper to show a simple bar row (no external libs)
  const BarRow = ({ values }) => {
    const max = Math.max(...values, 1);
    return (
      <div className="flex items-end gap-1 w-full mt-3">
        {values.map((v, i) => {
          const h = Math.max((v / max) * 48, 6); // 6–48px height
        return (
            <div
              key={i}
              className="flex-1 bg-white/15 rounded-sm"
              style={{ height: `${h}px` }}
              title={`Week ${i + 1}: ${v}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={Card}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 raleway-regular text-sm">New Users</p>
          <p className="text-white raleway-bold text-4xl mt-1">{total}</p>
        </div>

        {/* Range selector */}
        <div className="flex gap-2">
          <button
            className={`${Pill} ${range === "1m" ? PillActive : PillInactive}`}
            onClick={() => setRange("1m")}
          >
            1 Month
          </button>
          <button
            className={`${Pill} ${range === "2m" ? PillActive : PillInactive}`}
            onClick={() => setRange("2m")}
          >
            2 Months
          </button>
          <button
            className={`${Pill} ${range === "3m" ? PillActive : PillInactive}`}
            onClick={() => setRange("3m")}
          >
            3 Months
          </button>
        </div>
      </div>

      {/* Mini bar row to give a quick sense of trend */}
      <BarRow values={weekly} />

      {/* Caption */}
      <p className="text-white/60 raleway-regular text-xs mt-3">
        Showing new verified users over the last{" "}
        {range === "1m" ? "1 month" : range === "2m" ? "2 months" : "3 months"}.
      </p>
    </div>
  );
}
