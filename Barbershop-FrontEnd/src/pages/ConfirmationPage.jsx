import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineMarkEmailRead } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { RxCross1 } from 'react-icons/rx';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const toPgTime = (t) => {
    const s = String(t ?? '').trim();
    if (!s) throw new Error('Bad time: empty');

    // "1" or "14" -> "01:00:00" / "14:00:00"
    if (/^\d{1,2}$/.test(s)) return s.padStart(2, '0') + ':00:00';

    // "01:00" or "14:30" -> "01:00:00" / "14:30:00"
    if (/^\d{1,2}:\d{2}$/.test(s)) return s + ':00';

    // already "HH:MM:SS"
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(s)) return s;

    throw new Error(`Bad time format: ${s}`);
  };
  // Guard clause: Redirect if state is missing
  useEffect(() => {
    if (!state) {
      navigate('/booking');
    }
  }, [state, navigate]);

  if (!state) return null;

  const formatDisplayTime = (t) => {
    if (!t && t !== 0) return '';                   // undefined/null/'' -> ''
    const s = String(t).trim();

    if (/^\d{1,2}$/.test(s)) return s.padStart(2, '0') + ':00'; // "1" -> "01:00"
    if (/^\d{1,2}:\d{2}$/.test(s)) return s;                    // "01:00" -> "01:00"
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(s)) return s.slice(0, 5);   // "01:00:00" -> "01:00"
    return s;                                                   // fallback: just show whatever it is
  };
  const [error, setError] = useState("");

  const [userConfirmationCode, setUserConfirmationCode] = useState("");
  const { name, email, date, time, service, confirmationCode, emergency } = state;
  const proposals = Array.isArray(emergency?.proposals) ? emergency.proposals : [];


  const handleConfirmationSubmit = async (e) => {
    e.preventDefault();

    if (String(userConfirmationCode).trim() !== String(confirmationCode).trim()) {
      setError('Invalid confirmation code');
      return;
    }

    //verify email

    const verifyEmail = await fetch('http://localhost:3000/api/confirmation/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code: userConfirmationCode }),
    });

    if (!verifyEmail.ok) {
      const err = await verifyEmail.json().catch(() => ({}));
      setError(err.error || err.message || 'Email verification failed');
      return;
    }
    if (service === 'Emergency Cut') {
      if (!proposals.length) {
        setError('No proposed times were provided. Please go back and pick at least one time.');
        return;
      }
      const reqRes = await fetch('http://localhost:3000/api/emergency/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          service,
          reason: emergency?.reason || null,
          proposals, // [{date, time}]
        }),
      });
      if (!reqRes.ok) {
        const err = await reqRes.json().catch(() => ({}));
        setError(err.error || err.message || 'Failed to submit emergency request');
        return;
      }
      const emailRes = await fetch('http://localhost:3000/api/emergency/mail-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, reason: emergency?.reason || null, proposals }),
      });
      if (!emailRes.ok) {
        const err = await emailRes.json().catch(() => ({}));
        setError(err.error || err.message || 'Failed to send emergency request email');
        return;
      }
      navigate('/emergency-confirmation', {
        state: {
          name,
          email,
          service,
          proposals,
          message: 'Emergency request submitted. We’ll confirm your time via email. Please check your email for the confirmation code.',
        },
        replace: true,
      });
    } else {
      //normal booking
      const pgTime = toPgTime(time);
      const addBooking = await fetch('http://localhost:3000/api/confirmation/add-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, date, time: pgTime, service }),
      });


      if (!addBooking.ok) {
        const err = await addBooking.json().catch(() => ({}));
        setError(err.error || 'Could not create booking.');
        return;
      }

      const payload = await addBooking.json().catch(() => ({}));
      if (payload.booking) {
        sessionStorage.setItem('booking', JSON.stringify(payload.booking));
      }
      navigate(
        '/confirmed',
        {
          state: payload.booking || { name, email, date, time, service },
          replace: true,
        }
      );
    }
  };

  const fmtDate = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  const [resendDisabled, setResendDisabled] = useState(false);

  const handleResendEmail = async () => {
    try {
      setResendDisabled(true); // disable immediately
      const res = await fetch("http://localhost:3000/api/admin/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, confirmationCode }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to resend email");

      setError("");
      toast.success("Please check your inbox.");
    } catch (err) {
      console.error("❌ Error resending email:", err);
      setError(err.message || "Could not resend email");
    } finally {
      // Re-enable after 10 seconds
      setTimeout(() => setResendDisabled(false), 10000);
    }
  };


  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <MdOutlineMarkEmailRead className="text-6xl text-[#DDCA7D]" />
          <h1 className="text-3xl raleway-bold text-[#DDCA7D] text-center">Email Sent</h1>
          <p className="text-sm text-white text-center raleway-regular">
            Please check your email for the confirmation code.
          </p>

          {error && <p className="text-red-500 raleway-regular text-left text-sm font-bold">{error}</p>}

          {/* Summary */}
          <div className="text-sm text-white text-center raleway-regular mt-2 space-y-1">
            <p><span className="text-[#DDCA7D] font-bold">Name:</span> {name}</p>
            <p><span className="text-[#DDCA7D] font-bold">Email:</span> {email}</p>
            <p><span className="text-[#DDCA7D] font-bold">Service:</span> {service}</p>

            {service === 'Emergency Cut' ? (
              <div className="mt-2">
                <span className="text-[#DDCA7D] font-bold">Proposed times:</span>
                <div className="mt-2 flex flex-wrap gap-2 justify-center">
                  {proposals.map((p, i) => (
                    <span
                      key={`${p.date}-${p.time}-${i}`}
                      className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-[#DDCA7D]"
                    >
                      {fmtDate(p.date)} • {formatDisplayTime(p.time)}
                    </span>
                  ))}
                </div>
                {emergency?.reason && (
                  <p className="mt-2 text-white/80">
                    <span className="text-[#DDCA7D] font-bold">Reason:</span> {emergency.reason}
                  </p>
                )}
              </div>
            ) : (
              <p>
                <span className="text-[#DDCA7D] font-bold">Booking:</span>{' '}
                {fmtDate(date)} @ {formatDisplayTime(time)}
              </p>
            )}
          </div>

          {/* Code input */}
          <input
            type="text"
            placeholder="Confirmation Code"
            className="raleway-regular w-full p-2 rounded-md border border-white/20 text-[#DDCA7D] bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-0 mt-4"
            value={userConfirmationCode}
            onChange={(e) => setUserConfirmationCode(e.target.value)}
          />

          <button
            type="submit"
            className="bg-[#DDCA7D] text-[#1c1808] raleway-bold px-8 py-3 rounded-lg text-lg uppercase tracking-wide shadow-md hover:scale-105 transition-all flex items-center gap-2"
            onClick={handleConfirmationSubmit}
          >
            <TiTick className="text-2xl" />
            Confirm
          </button>

          <button
            type="button"
            disabled={resendDisabled}
            className={`bg-[#1c1808] text-[#DDCA7D] raleway-bold px-8 py-3 rounded-lg text-lg uppercase tracking-wide shadow-md hover:scale-105 transition-all flex items-center gap-2 ${resendDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            onClick={handleResendEmail}
          >
            <RxCross1 className="text-2xl" />
            {resendDisabled ? "Please wait..." : "Didn't get it, resend?"}
          </button>

        </div>
      </div>
    </div>
  );

}
