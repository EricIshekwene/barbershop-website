import React, { useMemo, useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

export default function EmergencyTimePicker({ onChange }) {
  // styles
  const Pill = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn border transition-all duration-300 focus:outline-none";
  const Primary = `${Pill} bg-white/10 border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md`;
  const SelectedPill = `${Pill} bg-[#DDCA7D] text-[#1c1808] border-[#DDCA7D]`;
  const HourBtn = `${Pill} bg-white/10 border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md`;
  const HourSelected = `${Pill} bg-green-500/20 border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md`;
  const HourMuted = `${Pill} bg-white/5 border-white/10 text-white/70 cursor-default`;
  const Chip = "px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-[#DDCA7D] text-sm flex items-center gap-2";
  const Remove = "ml-1 px-2 py-0.5 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 text-xs hover:bg-red-500/30";

  // date helpers
  const ymdLocal = (d) =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const tomorrow = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+1); return d; }, []);
  const todayISO = ymdLocal(today);
  const tomorrowISO = ymdLocal(tomorrow);

  // state
  const [activeDay, setActiveDay] = useState('today');
  const [todayTimes, setTodayTimes] = useState([]);
  const [tomorrowTimes, setTomorrowTimes] = useState([]);

  const totalCount = todayTimes.length + tomorrowTimes.length;
  const capReached = totalCount >= 3;

  const prettyDate = (iso) => {
    const [y,m,d] = iso.split('-').map(Number);
    const dt = new Date(y, m-1, d);
    return dt.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const hhmm = (h) => `${String(h).padStart(2,'0')}:00`;

  const emit = (tToday, tTomorrow) => {
    const proposals = [
      ...tToday.map(t => ({ date: todayISO, time: t })),
      ...tTomorrow.map(t => ({ date: tomorrowISO, time: t })),
    ];
    onChange?.({ proposals },);
  };

  const toggleHour = (h) => {
    const val = hhmm(h);
    if (activeDay === 'today') {
      setTodayTimes(prev => {
        const exists = prev.includes(val);
        let next = exists ? prev.filter(x => x !== val) : [...prev, val];
        if (!exists && next.length + tomorrowTimes.length > 3) return prev;
        return Array.from(new Set(next)).sort();
      });
    } else {
      setTomorrowTimes(prev => {
        const exists = prev.includes(val);
        let next = exists ? prev.filter(x => x !== val) : [...prev, val];
        if (!exists && todayTimes.length + next.length > 3) return prev;
        return Array.from(new Set(next)).sort();
      });
    }
  };
  useEffect(() => {
    const proposals = [
      ...todayTimes.map(t => ({ date: todayISO, time: t })),
      ...tomorrowTimes.map(t => ({ date: tomorrowISO, time: t })),
    ];
    onChange?.({ proposals });
  }, [todayTimes, tomorrowTimes, todayISO, tomorrowISO, onChange]);

 const removePick = (dateISO, time) => {
  if (dateISO === todayISO) {
    setTodayTimes(prev => prev.filter(t => t !== time));
  } else {
    setTomorrowTimes(prev => prev.filter(t => t !== time));
  }
};

  const activeISO = activeDay === 'today' ? todayISO : tomorrowISO;
  const activeList = activeDay === 'today' ? todayTimes : tomorrowTimes;

  const picks = [
    ...todayTimes.map(t => ({ date: todayISO, time: t })),
    ...tomorrowTimes.map(t => ({ date: tomorrowISO, time: t })),
  ].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl rounded-lg border border-white/20 p-4 bg-white/10">
      {/* Pills */}
      <div className="flex gap-2">
        <button
          type="button"
          className={activeDay === 'today' ? SelectedPill : Primary}
          onClick={() => setActiveDay('today')}
        >
          Today
        </button>
        <button
          type="button"
          className={activeDay === 'tomorrow' ? SelectedPill : Primary}
          onClick={() => setActiveDay('tomorrow')}
        >
          Tomorrow
        </button>
      </div>

      <p className="text-white text-sm raleway-regular">
        Selecting for: <span className="text-[#DDCA7D]">{prettyDate(activeISO)}</span>
      </p>

      {/* Single hour grid for current pill */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 w-full">
        {Array.from({ length: 24 }, (_, i) => i).map(h => {
          const label = hhmm(h);
          const selected = activeList.includes(label);
          const blocked = !selected && capReached;
          return (
            <button
              key={`${activeDay}-${h}`}
              type="button"
              className={selected ? HourSelected : blocked ? HourMuted : HourBtn}
              onClick={() => !blocked && toggleHour(h)}
              disabled={blocked}
              title={blocked ? "You can pick up to 3 total times across both days" : ""}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="w-full">
        <p className="text-white text-sm mb-2">Selected:</p>
        <div className="flex flex-wrap gap-2">
          {picks.length === 0 ? (
            <span className="text-white/70 text-sm">No times selected yet</span>
          ) : (
            picks.map(({ date, time }) => (
              <span key={`${date}-${time}`} className={Chip}>
                <span className="text-white/80">{prettyDate(date)}</span>
                <span>•</span>
                <span>{time}</span>
                <button className={Remove} type="button" onClick={() => removePick(date, time)}>
                  <FaTrashAlt />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      <p className="text-xs text-white/70">
        Total selected: <span className="text-[#DDCA7D] font-semibold">{totalCount}</span> / 3
      </p>
    </div>
  );
}
