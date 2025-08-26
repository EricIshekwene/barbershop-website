// DashboardStats.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function DashboardStats({
  fetchUrl = "http://localhost:3000/api/admin/dashboard-stats",
  cutsGoal = 30,
  timeZone = "America/New_York",
}) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showStats, setShowStats] = useState(true);
  const [data, setData] = useState({
    appointments: [],
    cuts: { completed: 0, goal: cutsGoal },
    newUsers: { "1m": { total: 0, weekly: [] }, "2m": { total: 0, weekly: [] }, "3m": { total: 0, weekly: [] } },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${fetchUrl}?windowDays=7&goal=${encodeURIComponent(cutsGoal)}`,
          { headers: { Accept: "application/json" }, credentials: 'include' }
        );
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);

        setData({
          appointments: Array.isArray(body.appointments) ? body.appointments : [],
          cuts: {
            completed: Number(body?.cuts?.completed) || 0,
            goal: Number(body?.cuts?.goal) || Number(cutsGoal) || 30,
          },
          newUsers: body?.newUsers ?? {
            "1m": { total: 0, weekly: [] },
            "2m": { total: 0, weekly: [] },
            "3m": { total: 0, weekly: [] },
          },
        });
        setErr("");
      } catch (e) {
        console.error("❌ Dashboard fetch error:", e);
        setErr("cant fetch stats");
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchUrl, cutsGoal]);

  if (!loading && err) {
    return <div className="text-white/80">{err}</div>;
  }

  return (
    <div className=" border border-white/20 rounded-lg p-4 m-8">
      {/* Header with dropdown toggle */}
      <div className="flex flex-row items-center gap-2 mb-4">
        <p className="text-2xl raleway-bold text-white">Dashboard Stats</p>
        <FaChevronDown
          className={`text-white text-2xl cursor-pointer transition-transform duration-200 ${
            showStats ? "rotate-90" : ""
          }`}
          onClick={() => setShowStats((v) => !v)}
        />
      </div>

      {/* Grid shown only if expanded */}
      {showStats && (
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <div className="flex flex-col gap-6">
            <UpcomingAppointmentsCard appointments={data.appointments} timeZone={timeZone} />
            <NewUsersCard newUsers={data.newUsers} />
          </div>
          <CutsCompletedCard completed={data.cuts.completed} goal={data.cuts.goal} />
        </div>
      )}
    </div>
  );
}

/* ---------------------- Upcoming Appointments ---------------------- */
function UpcomingAppointmentsCard({ appointments = [], timeZone = "America/New_York" }) {
  const Card = "flex flex-col gap-3 bg-white/10 border border-white/20 rounded-lg p-4";
  const Title = "text-white raleway-bold text-xl";
  const Count = "text-[#DDCA7D] raleway-bold text-4xl";
  const Subtle = "text-white/70 text-sm raleway-regular";
  const PillBase = "px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 border";
  const PillActive = "text-black bg-[#DDCA7D] border-[#DDCA7D]";
  const PillInactive = "text-[#DDCA7D] bg-white/5 border-white/20 hover:bg-white/10";

  const RANGES = [
    { key: "today", label: "Today", days: 0 },
    { key: "3d", label: "3 Days", days: 3 },
    { key: "7d", label: "Week", days: 7 },
  ];
  const [rangeKey, setRangeKey] = useState("today");

  const nowTz = useMemo(
    () => new Date(new Date().toLocaleString("en-US", { timeZone })),
    [timeZone]
  );

  const endDate = useMemo(() => {
    const d = new Date(nowTz);
    const picked = RANGES.find((r) => r.key === rangeKey)?.days ?? 0;
    if (picked === 0) {
      d.setHours(23, 59, 59, 999);
      return d;
    }
    d.setDate(d.getDate() + picked);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [rangeKey, nowTz]);

  const startOfToday = useMemo(() => {
    const d = new Date(nowTz);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [nowTz]);

  const toApptDate = (a) => {
    const dateStr = a.appointment_date || a.date || a.slot_date;
    const timeStr = a.appointment_time || a.time || a.slot_time || "00:00";
    const [hh = "0", mm = "0"] = String(timeStr).slice(0, 5).split(":");
    const d = new Date(dateStr);
    d.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
    return d;
  };

  const isCancelled = (a) => {
    const s = String(a?.status || a?.bookingStatus || "").toLowerCase();
    return s === "cancelled" || s === "canceled";
  };

  const count = useMemo(() => {
    return appointments.filter((a) => {
      if (isCancelled(a)) return false;
      const dt = toApptDate(a);
      return dt >= startOfToday && dt <= endDate;
    }).length;
  }, [appointments, startOfToday, endDate]);

  const prettyRange = useMemo(() => RANGES.find((r) => r.key === rangeKey)?.label || "Today", [rangeKey]);

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
      <p className={Subtle}>Filtered out cancelled appointments.</p>
    </div>
  );
}

/* ---------------------- Cuts Completed ---------------------- */
function CutsCompletedCard({ completed = 0, goal = 30 }) {
  const Card = "bg-white/10 border border-white/20 rounded-lg p-4 w-full";
  const pct = useMemo(() => {
    const p = Math.min(100, Math.round(((Number(completed) || 0) / (Number(goal) || 1)) * 100));
    return Number.isFinite(p) ? p : 0;
  }, [completed, goal]);

  const size = 128;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
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

      <div className="flex items-center justify-center">
        <svg width="180" height="180" viewBox={`0 0 ${size} ${size}`} className="block">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={stroke} />
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

      <p className="text-white/60 raleway-regular text-xs mt-3">Progress toward your cuts goal.</p>
    </div>
  );
}

/* ---------------------- New Users ---------------------- */
function NewUsersCard({ newUsers = { "1m": { total: 0, weekly: [] }, "2m": { total: 0, weekly: [] }, "3m": { total: 0, weekly: [] } } }) {
  const Card = "bg-white/10 border border-white/20 rounded-lg p-4 w-full";
  const Pill = "px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none";
  const PillActive = "bg-[#DDCA7D] text-black shadow";
  const PillInactive = "bg-white/10 text-[#DDCA7D] hover:bg-white/20";

  const [range, setRange] = useState("1m");
  const snap = newUsers?.[range] || { total: 0, weekly: [] };

  const BarRow = ({ values }) => {
    const max = Math.max(...values, 1);
    return (
      <div className="flex items-end gap-1 w-full mt-3">
        {values.map((v, i) => {
          const h = Math.max((v / max) * 48, 6);
          return <div key={i} className="flex-1 bg-white/15 rounded-sm" style={{ height: `${h}px` }} title={`Week ${i + 1}: ${v}`} />;
        })}
      </div>
    );
  };

  return (
    <div className={Card}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 raleway-regular text-sm">New Users</p>
          <p className="text-white raleway-bold text-4xl mt-1">{snap.total || 0}</p>
        </div>
        <div className="flex gap-2">
          <button className={`${Pill} ${range === "1m" ? PillActive : PillInactive}`} onClick={() => setRange("1m")}>1 Month</button>
          <button className={`${Pill} ${range === "2m" ? PillActive : PillInactive}`} onClick={() => setRange("2m")}>2 Months</button>
          <button className={`${Pill} ${range === "3m" ? PillActive : PillInactive}`} onClick={() => setRange("3m")}>3 Months</button>
        </div>
      </div>

      <BarRow values={snap.weekly || []} />
      <p className="text-white/60 raleway-regular text-xs mt-3">
        Showing new verified users over the last {range === "1m" ? "1 month" : range === "2m" ? "2 months" : "3 months"}.
      </p>
    </div>
  );
}
