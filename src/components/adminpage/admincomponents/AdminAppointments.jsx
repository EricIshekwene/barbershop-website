import React from 'react'
import { FaInstagram } from "react-icons/fa";
import Appointment from './AdminSubcomponents/Appointment'
export default function AdminAppointments() {
    const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
    const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn  bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-1"
    
    return (
        <div className='flex flex-col bg-black m-8 mt-4 p-4 rounded-lg gap-4 border-1 border-white/20'>
            <p className='text-2xl raleway-bold text-white'>Upcoming Appointments</p>
            <Appointment name="John Doe" time="10:00 AM" date="10/10/2025" service="Low Taper $20" instagram="john_doe" status="Unverified" bookingStatus="Pending" />
            <Appointment name="Bitch Nigga" time="10:00 AM" date="10/10/2025" service="Low Taper $20" instagram="fuckass" status="Verified" bookingStatus="Approved" /> 
            <Appointment name="jigga" time="10:00 AM" date="10/10/2025" service="Low Taper $20" instagram="livid" status="Verified" bookingStatus="Pending" /> 
        </div>
    )
}