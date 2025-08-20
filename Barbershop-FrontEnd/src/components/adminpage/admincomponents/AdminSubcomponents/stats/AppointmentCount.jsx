import React, { useMemo, useState } from "react";

/**
 * UpcomingAppointmentsStat
 * - Shows total upcoming appointments within a selected window
 * - Pills: Week / 2 Weeks / Month
 * - Uses fake data relative to "today"
 */
export default function AppointmentCount() {
  // --- styles (matching your palette) ---
  const Card = "flex flex-col gap-3 bg-white/10 border border-white/20 rounded-lg p-4";
  const Title = "text-white raleway-bold text-xl";
  const Count = "text-[#DDCA7D] raleway-bold text-4xl";
  const Subtle = "text-white/70 text-sm raleway-regular";

  const PillBase =
    "px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 border";
  const PillActive =
    "text-black bg-[#DDCA7D] border-[#DDCA7D]";
  const PillInactive =
    "text-[#DDCA7D] bg-white/5 border-white/20 hover:bg-white/10";

  // --- fake upcoming appointments (next 40 days) ---
  const today = new Date();
  const addDays = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString(); // pretend these are appointment_date ISO strings
  };

  const fakeAppointments = [
    { name: "John Doe", date: addDays(1) },
    { name: "Jane Smith", date: addDays(2) },
    { name: "Alex Lee", date: addDays(3) },
    { name: "Chris P.", date: addDays(6) },
    { name: "Sam R.", date: addDays(8) },
    { name: "Taylor K.", date: addDays(10) },
    { name: "Jordan M.", date: addDays(12) },
    { name: "Riley Q.", date: addDays(15) },
    { name: "Casey L.", date: addDays(19) },
    { name: "Priya N.", date: addDays(22) },
    { name: "Omar A.", date: addDays(26) },
    { name: "Mina V.", date: addDays(30) },
    { name: "Leo T.", date: addDays(33) },
    { name: "Ava W.", date: addDays(37) },
    { name: "Noah Z.", date: addDays(40) },
  ];

  // --- range selection ---
  const RANGES = [
    { key: "7", label: "Week", days: 7 },
    { key: "14", label: "2 Weeks", days: 14 },
    { key: "30", label: "Month", days: 30 },
  ];
  const [rangeKey, setRangeKey] = useState("7");

  // --- compute count within selected window ---
  const endDate = useMemo(() => {
    const d = new Date(today);
    const picked = RANGES.find((r) => r.key === rangeKey)?.days ?? 7;
    d.setDate(d.getDate() + picked);
    return d;
  }, [rangeKey]);

  const count = useMemo(() => {
    return fakeAppointments.filter((a) => {
      const d = new Date(a.date);
      return d >= today && d <= endDate;
    }).length;
  }, [fakeAppointments, endDate, today]);

  // pretty range text
  const prettyRange = useMemo(() => {
    const picked = RANGES.find((r) => r.key === rangeKey);
    return picked?.label || "Week";
  }, [rangeKey]);

  return (
    <div className={Card}>
      <div className="flex items-center gap-2 justify-between">
        <p className={Title}>Upcoming Appointments</p>

        <div className="flex gap-2">
          {RANGES.map((r) => {
            const active = r.key === rangeKey;
            return (
              <button
                key={r.key}
                onClick={() => setRangeKey(r.key)}
                className={`${PillBase} ${active ? PillActive : PillInactive}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-end gap-3">
        <span className={Count}>{count}</span>
        <span className={Subtle}>in the next {prettyRange.toLowerCase()}</span>
      </div>

      <p className={Subtle}>
        (Fake data • {fakeAppointments.length} total upcoming over ~40 days)
      </p>
    </div>
  );
}
