import React, { useState, useEffect } from 'react';

export default function BookingTime({ numbers, setTime }) {
    const [bookingTime, setBookingTime] = useState(null);
    
    return (
        
        <div className="w-1/4 min-w-[320px] mx-auto ">
            <div className="flex flex-wrap flex-row items-center justify-center">
            {numbers.map((num, idx) => (
              <button
                key={idx}
                className={`px-5 py-1.5 m-2 rounded-lg text-sm sm:text-sm md:text-md xl:text-md border-2 border-[#DDCA7D]
                    font-bold montserrat-navbar-btn  text-[#1c1808] transition-all duration-500
                    ${bookingTime === num ? "bg-[#1c1808]  text-[#DDCA7D]  shadow-lg shadow-[#DDCA7D]/30" : "bg-white  text-[#1c1808]"}`}
                onClick={() => {
                    setBookingTime(num)
                    setTime(num)
                }}
              >
                {num}:00
              </button>
            ))}
            </div>
        </div>
    )
}