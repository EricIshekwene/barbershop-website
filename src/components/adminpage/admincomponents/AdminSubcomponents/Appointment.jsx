import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

export default function Appointment({name, time, date, service, instagram, status, bookingStatus}) {
    const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
    const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-1"
    
    return (
        <div className='flex flex-row justify-start items-start bg-white/10  border border-white/20 rounded-lg p-4 gap-4'>
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-row items-center gap-2'>
                <p className='text-white raleway-bold text-4xl'>{name}</p>
                {status === "Verified" && <button className={UpdateTimeslotsStyle} >  <TiTick className='text-green-300 text-xl'/> </button> }
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='text-white text-xs raleway-regular'>{time}</p>
                    <p className='text-white text-xs raleway-regular'>{date}</p>
                    <p className='text-white text-xs raleway-regular'>{service}</p>
                </div>
                </div>
                <div className='flex flex-row items-center  rounded-lg p-2 gap-4 ml-auto self-center'>
                    <div className='flex flex-row items-center gap-1'>
                        <FaInstagram className='text-[#DDCA7D] text-xl'/>
                        <p className='text-[#DDCA7D] text-xl raleway-regular'>{instagram}</p>
                    </div>
                    <button className={AvailableTimeslotsStyle}>Mail</button>
                    <button className={AvailableTimeslotsStyle}>Reschedule</button>
                    {bookingStatus === "Pending" && <button className={UpdateTimeslotsStyle}>Approve</button>}
                    <button className={UnavailableVerifiedTimeslotsStyle}>Cancel</button>
                    {status === "Unverified" && <button className={UnavailableUnverifiedTimeslotsStyle}>Verify</button>}
                </div>
            </div>
    )
}