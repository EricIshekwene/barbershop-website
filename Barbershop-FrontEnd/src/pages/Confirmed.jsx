import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';

export default function Confirmed() {
  const navigate = useNavigate();
  const { state } = useLocation(); // might be null on refresh/direct hit
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  // Try location.state first, then sessionStorage fallback
  const data = useMemo(() => {
    if (state) return state;
    try {
      return JSON.parse(sessionStorage.getItem("booking") || "{}");
    } catch {
      return {};
    }
  }, [state]);

  const formatDisplayTime = (t) => {
    if (!t && t !== 0) return '';
    const s = String(t).trim();
    if (/^\d{1,2}$/.test(s)) return s.padStart(2, '0') + ':00'; // "1" -> "01:00"
    if (/^\d{1,2}:\d{2}$/.test(s)) return s;                    // "01:00"
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(s)) return s.slice(0, 5);   // "01:00:00" -> "01:00"
    return s;
  };


  useEffect(() => {
    const hasSaved = !!sessionStorage.getItem("booking");
    if (!state && !hasSaved) {
      navigate("/booking", { replace: true });
      return;
    }
    setChecking(false);
  }, [state, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <p className="text-white raleway-regular">Loading…</p>
      </div>
    );
  }

  const {
    name = "",
    email = "",
    phone = "",
    instagram = "",
    date = "",
    time = "",
    service = "",
    service_type = ""
  } = data;

  const formatDisplayDate = (d) => {
    if (!d) return '';
    if (typeof d === 'string' && d.includes('T')) {
      // ISO -> local date string
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    // already "YYYY-MM-DD" from DB
    return d;
  };

  // when preparing values:
  const rawDate = data.date || data.appointment_date || '';
  const displayDate = formatDisplayDate(rawDate);


  // Support both shapes from state or DB

  const rawTime = data.time || data.appointment_time || '';
  const displayTime = formatDisplayTime(rawTime);
  const displayDateSafe = displayDate || '(date pending)';
  const displayTimeSafe = displayTime || '(time pending)';
  const displayService = service || service_type || '(service)';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          {!error ? (
            <>
              <h1 className="text-3xl raleway-bold text-[#DDCA7D] text-center">Booking Confirmed</h1>
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm text-white text-center raleway-regular">{name}</p>
                <p className="text-sm text-white text-center raleway-regular">{email}</p>
                <p className="text-sm text-white text-center raleway-regular">
                  {displayService} on {displayDateSafe} @ {displayTimeSafe}
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl raleway-bold text-red-500 text-center">Booking Failed</h1>
              <p className="text-sm text-white text-center raleway-regular">{error}</p>
              <button
                type="button"
                className="bg-[#1c1808] text-[#DDCA7D] raleway-bold px-8 py-3 rounded-lg text-lg uppercase tracking-wide shadow-md hover:scale-105 transition-all flex items-center gap-2"
                onClick={() => navigate('/booking')}
              >
                <RxCross1 className="text-2xl" />
                Back to Booking
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
