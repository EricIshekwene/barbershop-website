import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { TiTick } from 'react-icons/ti';
import { RxCross1 } from 'react-icons/rx';
import { FaCalendarAlt, FaClock, FaHome, FaUser, FaRegEnvelope } from 'react-icons/fa';
import { SiCashapp, SiVenmo } from "react-icons/si";

export default function Confirmed() {
  const navigate = useNavigate();
  const { state } = useLocation(); 
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  const data = useMemo(() => {
    if (state) return state;
    try {
      return JSON.parse(sessionStorage.getItem("booking") || "{}");
    } catch {
      return {};
    }
  }, [state]);

  const formatDisplayTime = (t) => {
    if (t === 0 || t) {
      let h = String(t).trim();
      if (/^\d{1,2}$/.test(h)) h = h.padStart(2, '0') + ':00';
      if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(h)) {
        const [HH, mm] = h.split(':');
        const n = Number(HH);
        const period = n >= 12 ? 'PM' : 'AM';
        const h12 = n % 12 === 0 ? 12 : n % 12;
        return `${h12}:${mm} ${period}`;
      }
      return h;
    }
    return '';
  };

  const formatDisplayDate = (d) => {
    if (!d) return '';
    if (typeof d === 'string' && d.includes('T')) {
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    try {
      const [y, m, dd] = d.split('-').map(Number);
      const dt = new Date(y, (m || 1) - 1, dd || 1);
      return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return d;
    }
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
    service = "",
    service_type = "",
    date = "",
    time = ""
  } = data;

  const rawDate = data.date || data.appointment_date || '';
  const rawTime = data.time || data.appointment_time || '';

  const displayDateSafe = formatDisplayDate(rawDate) || '(date pending)';
  const displayTimeSafe = formatDisplayTime(rawTime) || '(time pending)';
  const displayService = service || service_type || '(service)';

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      
      {/* Background gradients + grid (same as before) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#DDCA7D]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(221,202,125,0.12),transparent_60%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="h-full w-full bg-[linear-gradient(transparent,transparent_31px,#fff_32px),linear-gradient(90deg,transparent,transparent_31px,#fff_32px)] bg-[length:32px_32px]" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5 sm:px-6 py-16">
        <div className="w-full rounded-3xl border border-white/15 bg-white/10 p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">

          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#DDCA7D]/30 bg-[#DDCA7D]/15">
              {error ? (
                <RxCross1 className="text-2xl text-red-400" />
              ) : (
                <TiTick className="text-3xl text-[#DDCA7D]" />
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight raleway-bold">
                {error ? 'Booking Failed' : 'Booking Confirmed'}
              </h1>
              <p className="text-sm text-white/70 raleway-regular">
                {error
                  ? 'Something went wrong while confirming your booking.'
                  : 'Thanks—your appointment has been set. Look for a confirmation email shortly.'}
              </p>
            </div>
          </div>

          {/* Booking details chips */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-[#DDCA7D]">
              <FaUser className="opacity-90" /> {name || '(name)'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-[#DDCA7D]">
              <FaCalendarAlt className="opacity-90" /> {displayDateSafe}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-[#DDCA7D]">
              <FaClock className="opacity-90" /> {displayTimeSafe}
            </span>
          </div>

          {/* Info grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Service</p>
              <p className="mt-1 text-sm font-semibold">{displayService}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Email</p>
              <p className="mt-1 text-sm font-semibold truncate">{email || '(email)'}</p>
            </div>
          </div>

        
          {/* CTA row */}
          <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <FaHome className="text-[#DDCA7D]" />
              Back to Home
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {/* Fine print */}
          <p className="mt-6 text-center text-xs text-white/50">
            Need to make a change? Reply to the confirmation email and we’ll adjust your appointment.
          </p>
        </div>
      </main>
    </div>
  );
}
