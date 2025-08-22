import React, { useState } from 'react';
import toast from 'react-hot-toast';
export default function CancelAppointment({ name, date, time, closeModal, email, service,  onCancelled }) {
  const AvailableTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none";
  const UnavailableVerifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none";
  const UnavailableUnverifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none";
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const normalizeDateTime = (isoDate, timeStr) => {
      const base = new Date(isoDate);
      const datePart = base.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      let timePart = "";
      if (timeStr) {
        const [hh = "0", mm = "0"] = timeStr.split(":");
        const dt = new Date(base);
        dt.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
        timePart = dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      } else {
        timePart = base.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      }
      return { datePart, timePart };
    };
    const { datePart: prettyDate, timePart: prettyTime } = normalizeDateTime(date, time);
    const handleCancel = async () => {
      if (submitting) return;            // NEW: prevent double click
  setSubmitting(true); 
      try {
        const res = await fetch(`http://localhost:3000/api/admin/cancel-appointment`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, date, time, service }),
        });
  
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Failed to cancel appointment");
  
        toast.success("Appointment cancelled successfully");
        setError("");

          onCancelled();   
          closeModal();
      } catch (err) {
        console.error("❌ Error cancelling appointment:", err);
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeModal} 
    >
       <div
        className="flex flex-col gap-6 justify-center items-center rounded-lg p-6 w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex flex-col gap-6 justify-center items-center">
          <p className="bg-white/10 text-white text-center focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full m-4">
            Are you sure you want to cancel <span className="text-[#DDCA7D]">{name}</span> on <span className="text-[#DDCA7D]">{prettyDate}</span> at <span className="text-[#DDCA7D]">{prettyTime}</span>?
          </p>
          {error && <p className={UnavailableVerifiedTimeslotsStyle}>{error}</p>}
          <div className="flex flex-row justify-center items-center gap-4 w-full">
            <button onClick={closeModal} className={UnavailableUnverifiedTimeslotsStyle}>
              Back
            </button>
            <button onClick={handleCancel} disabled={submitting} className={UnavailableVerifiedTimeslotsStyle}>
              {submitting ? "Cancelling..." : "Cancel Appointment"}
            </button>
          </div>
        </div>
      </div>
      </div>
  );
}
