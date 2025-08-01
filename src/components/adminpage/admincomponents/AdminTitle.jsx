import React from 'react'

export default function AdminTitle() {
    return (
        <div className='flex flex-row bg-black items-center justify-between p-4'>
            <h1 className='text-3xl raleway-regular text-[#DDCA7D] text-center'>Welcome Miguel</h1>
            <div className='flex flex-row gap-4'> <a
                href="#"
                className="relative inline-flex items-center justify-center px-5 py-2 mr-3 rounded-xl text-sm font-semibold montserrat-navbar-btn 
             bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D]
             hover:bg-white/20 hover:shadow-md transition-all duration-300
             focus:outline-none focus:ring-2 focus:ring-[#DDCA7D]/50 focus:ring-offset-1"
            >
                Clients
            </a>
                <a
                    href="#"
                    className="relative inline-flex items-center justify-center px-5 py-2 mr-3 rounded-xl text-sm font-semibold montserrat-navbar-btn 
             bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D]
             hover:bg-white/20 hover:shadow-md transition-all duration-300
             focus:outline-none focus:ring-2 focus:ring-[#DDCA7D]/50 focus:ring-offset-1"
                >
                    Appointments
                </a>
                <a
                    href="#"
                    className="relative inline-flex items-center justify-center px-5 py-2 mr-3 rounded-xl text-sm font-semibold montserrat-navbar-btn 
             bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D]
             hover:bg-white/20 hover:shadow-md transition-all duration-300
             focus:outline-none focus:ring-2 focus:ring-[#DDCA7D]/50 focus:ring-offset-1"
                >
                    Home
                </a>
                </div>


        </div>
    )
}