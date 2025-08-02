import React from 'react'

export default function MailModal({name}) {
    const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
    const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none "
    
    return (
        <div className='bg-white/10 border border-white/20 rounded-lg p-4 w-1/2'>
        <div className=' flex flex-col justify-center items-center'>
            <p className='text-white  raleway-bold text-2xl'>Mail to {name}</p>
            <input type="text" placeholder='Subject' 
                className='bg-white/10 text-[#DDCA7D] focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full m-4' />
            <textarea 
                placeholder='Message' 
                className='bg-white/10 focus:outline-none text-[#DDCA7D] raleway-regular border border-white/20 m-4 rounded-lg p-2 w-full resize-none' 
            />
            <div className='flex flex-row justify-end items-center gap-4 w-full'>
                <button className={AvailableTimeslotsStyle}>Payment Reminder</button>
                <button className={UnavailableUnverifiedTimeslotsStyle}>Cancel Appointment</button>
                <button className={UnavailableVerifiedTimeslotsStyle}>Cancel</button>
                <button className={UpdateTimeslotsStyle}>Send</button>
            </div>
        </div>
        
    </div>
  )
}   