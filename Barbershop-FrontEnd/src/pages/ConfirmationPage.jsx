import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineMarkEmailRead } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { RxCross1 } from 'react-icons/rx';
import { useState, useEffect } from 'react';

export default function ConfirmationPage() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const state = location.state;

  // Guard clause: Redirect if state is missing
  useEffect(() => {
    if (!state) {
      navigate('/booking');
    }
  }, [state, navigate]);
  
  if (!state) return null;
  

  const [Error, setError] = useState("");
  const [userConfirmationCode, setUserConfirmationCode] = useState("");
  const { name, email, date, time, service, confirmationCode } = state;

  const handleConfirmationSubmit = (e) => {
    e.preventDefault();
    if (String(userConfirmationCode).trim() === String(confirmationCode).trim()) {
      navigate('/');
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
            <p><span className="text-[#DDCA7D] font-bold">Booking:</span> {date} @ {time}:00</p>
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
