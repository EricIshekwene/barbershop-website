import React, { useState } from 'react'
import { FaInstagram } from "react-icons/fa";
import UpcomingAppointment from './AdminSubcomponents/UpcomingAppointment'
import PastAppointments from './AdminSubcomponents/PastAppointments'
import { FaChevronDown } from "react-icons/fa";

export default function AdminAppointments() {
    const [showUpcomingAppointments, setShowUpcomingAppointments] = useState(true);
    const [showPastAppointments, setShowPastAppointments] = useState(false);

    // Handler for toggling Upcoming Appointments
    const handleToggleUpcoming = () => {
        setShowUpcomingAppointments(!showUpcomingAppointments);

    };

    // Handler for toggling Past Appointments
    const handleTogglePast = () => {
        setShowPastAppointments(!showPastAppointments);

    };

    return (
        <div className='flex flex-col bg-black m-8 mt-4 p-4 rounded-lg gap-4 border-1 border-white/20'>
            <div
                className="flex flex-row items-center gap-2 cursor-pointer"
                
            >
                <p className='text-2xl raleway-bold text-white'>Upcoming Appointments</p>
                <FaChevronDown
                    className={`text-white text-2xl transition-transform duration-200 ${showUpcomingAppointments ? 'rotate-90' : ''}`}
                    onClick={handleToggleUpcoming}
                />
                {showUpcomingAppointments && <input type="text" placeholder='Search' className='bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-1/4 focus:outline-none   ' />}
            </div>
            {showUpcomingAppointments && (
                <>
                    <UpcomingAppointment name="John Doe" time="10:00 AM" date="10/10/2025" service="Low Taper $20" instagram="john_doe" status="Unverified" bookingStatus="Pending" />
                    <UpcomingAppointment name="Jane Smith" time="11:00 AM" date="10/10/2025" service="Mid Fade $25" instagram="janesmith" status="Verified" bookingStatus="Approved" />
                    <UpcomingAppointment name="Alex Lee" time="12:00 PM" date="10/10/2025" service="High Fade $30" instagram="alexlee" status="Verified" bookingStatus="Pending" />
                </>
            )}
            <div
                className="flex flex-row items-center gap-2 cursor-pointer"
                
            >
                <p className='text-2xl raleway-bold text-white'>Past Appointments</p>
                <FaChevronDown
                    className={`text-white text-2xl transition-transform duration-200 ${showPastAppointments ? 'rotate-90' : ''}`}
                    onClick={handleTogglePast}
                />
                {showPastAppointments && <input type="text" placeholder='Search' className='bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-1/4 focus:outline-none' />}
            </div>
            {showPastAppointments && (
                <>
                    <PastAppointments name="Johnny" time="10:00 AM" date="10/10/2025" service="Low Taper $20" instagram="john_doe" status="Verified" bookingStatus="Pending" />
                    <PastAppointments name="Sarah" time="1:00 PM" date="09/10/2025" service="Buzz Cut $15" instagram="sarahcutz" status="Unverified" bookingStatus="Completed" />
                </>
            )}
        </div>
    )
}