import React from 'react';

export default function MailModal({ name, closeModal }) {
  const AvailableTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none";
  const UnavailableVerifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none";
  const UnavailableUnverifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none";
  const UpdateTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeModal}
    >
      {/* Modal content box */}
      <div
        className="flex flex-col justify-center items-center rounded-lg p-6 w-[90%] max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white raleway-bold text-2xl mb-4">Mail to {name}</p>
        <input
          type="text"
          placeholder="Subject"
          className="bg-white/10 text-[#DDCA7D] focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full mb-4"
        />
        <textarea
          placeholder="Message"
          className="bg-white/10 focus:outline-none text-[#DDCA7D] raleway-regular border border-white/20 rounded-lg p-2 w-full h-32 resize-none mb-4"
        />
        <div className="flex flex-row justify-end items-center gap-4 w-full">
          <button className={AvailableTimeslotsStyle}>Payment Reminder</button>
          <button className={UnavailableUnverifiedTimeslotsStyle} onClick={closeModal}>
            Cancel Appointment
          </button>
          <button className={UnavailableVerifiedTimeslotsStyle} onClick={closeModal}>
            Cancel
          </button>
          <button className={UpdateTimeslotsStyle} onClick={closeModal}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
