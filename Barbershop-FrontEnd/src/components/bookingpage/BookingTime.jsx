import React, { useState, useEffect } from 'react';

export default function BookingTime({ numbers, setTime }) {
    const [bookingTime, setBookingTime] = useState(null);
    const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
    const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn  bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none "
    
    return (
        
        <div className="w-1/5 min-w-[320px] mx-auto ">
            <div className="flex gap-2 flex-wrap flex-row items-center justify-center">
            {numbers ? numbers.map((num, idx) => (
              <button
                key={idx}
                className={`${bookingTime === num ? UpdateTimeslotsStyle : AvailableTimeslotsStyle}`}
                onClick={() => {
                    setBookingTime(num)
                    setTime(num)
                }}
              >
                {num}:00
              </button>
            )) : <p className={UnavailableUnverifiedTimeslotsStyle}>No timeslots available</p>}
            </div>
        </div>
    )
}