import React from 'react';

export default function CancelAppointment({ name, date, time, closeModal }) {
  const AvailableTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none";
  const UnavailableVerifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none";
  const UnavailableUnverifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeModal} 
    >
      <div
        className="bg-[#1e1e1e] border border-white/20 rounded-xl p-6 w-[90%] max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()} // prevent inner clicks from closing
      >
        <div className="flex flex-col gap-6 justify-center items-center">
          <p className="text-white text-center raleway-bold text-lg sm:text-xl">
            Are you sure you want to cancel <span className="text-[#DDCA7D]">{name}</span> on <span className="text-[#DDCA7D]">{date}</span> at <span className="text-[#DDCA7D]">{time}</span>?
          </p>
          <div className="flex flex-row justify-center items-center gap-4 w-full">
            <button className={UnavailableUnverifiedTimeslotsStyle}>
              Cancel Appointment
            </button>
            <button onClick={closeModal} className={UnavailableVerifiedTimeslotsStyle}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
