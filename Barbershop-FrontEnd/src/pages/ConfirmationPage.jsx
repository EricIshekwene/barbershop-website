import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineMarkEmailRead } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { RxCross1 } from 'react-icons/rx';
import { useState, useEffect } from 'react';


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
  
    if (/^\d{1,2}$/.test(s)) return s.padStart(2,'0') + ':00'; // "1" -> "01:00"
    if (/^\d{1,2}:\d{2}$/.test(s)) return s;                    // "01:00" -> "01:00"
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(s)) return s.slice(0,5);   // "01:00:00" -> "01:00"
    return s;                                                   // fallback: just show whatever it is
  };
  const [Error, setError] = useState("");
  const [userConfirmationCode, setUserConfirmationCode] = useState("");
  const { name, email, date, time, service, confirmationCode } = state;

  const handleConfirmationSubmit = async (e) => {
    e.preventDefault();
    if (String(userConfirmationCode).trim() === String(confirmationCode).trim()) {
      
      //verify email
      
      const verifyEmail = await fetch('http://localhost:3000/api/confirmation/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: userConfirmationCode }),
      });
      if (verifyEmail.ok) {
        //add booking to database
        const pgTime = toPgTime(time);
        const addBooking = await fetch('http://localhost:3000/api/confirmation/add-booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, date, time: pgTime, service }),
        });
        if (addBooking.ok) {
          const payload = await addBooking.json().catch(() => ({}));
          if (payload.booking) {
            // persist for refresh-safe confirmed page
            sessionStorage.setItem('booking', JSON.stringify(payload.booking));
          }
          navigate('/confirmed', { state: payload.booking || { name, email, date, time, service } });
        } else {
          setError("Failed to add booking");
        }
      } else {
        setError("Account with this information does not exist");
      }
    } else {
      setError("Invalid confirmation code");
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
          {Error && <p className="text-red-500 raleway-regular text-left text-sm font-bold">{Error}</p>}
          
          <div className="text-sm text-white text-center raleway-regular mt-2">
            <p><span className="text-[#DDCA7D] font-bold">Name:</span> {name}</p>
            <p><span className="text-[#DDCA7D] font-bold">Email:</span> {email}</p>
            <p><span className="text-[#DDCA7D] font-bold">Booking:</span> {date} @ {formatDisplayTime(time)}</p>
            <p><span className="text-[#DDCA7D] font-bold">Service:</span> {service}</p>
          </div>

          <input
            type="text"
            placeholder="Confirmation Code"
            className="raleway-regular w-full p-2 rounded-md border border-white/20 text-[#DDCA7D] bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-0 mt-4"
            value={userConfirmationCode}
            onChange={(e) => setUserConfirmationCode(e.target.value)}
          />

          <button type="submit"
            className="bg-[#DDCA7D] text-[#1c1808] raleway-bold px-8 py-3 rounded-lg text-lg uppercase tracking-wide shadow-md hover:scale-105 transition-all flex items-center gap-2"
            onClick={handleConfirmationSubmit}
          >
            <TiTick className="text-2xl" />
            All Good!
          </button>

          <button type="button"
            className="bg-[#1c1808] text-[#DDCA7D] raleway-bold px-8 py-3 rounded-lg text-lg uppercase tracking-wide shadow-md hover:scale-105 transition-all flex items-center gap-2"
            onClick={() => navigate('/booking')}
          >
            <RxCross1 className="text-2xl" />
            Didn’t get the email?
          </button>
        </div>
      </div>
    </div>
  );
}
