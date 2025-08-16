import React, { useState, useEffect } from 'react'
import { FaInstagram } from "react-icons/fa";
import UpcomingAppointment from './AdminSubcomponents/UpcomingAppointment'
import PastAppointments from './AdminSubcomponents/PastAppointments'
import { FaChevronDown } from "react-icons/fa";

export default function AdminAppointments() {
    const [showUpcomingAppointments, setShowUpcomingAppointments] = useState(true);
    const [showPastAppointments, setShowPastAppointments] = useState(false);
    const [upcomingAppointmentCount, setUpcomingAppointmentCount] = useState(0);
    const [pastAppointmentCount, setPastAppointmentCount] = useState(0);
    const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
    const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn  bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none "
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState(0);
    const [pastAppointmentsCount, setPastAppointmentsCount] = useState(0);
    const [error, setError] = useState(null);
    // Handler for toggling Upcoming Appointments
    const handleToggleUpcoming = () => {
        setShowUpcomingAppointments(!showUpcomingAppointments);

    };

    // Handler for toggling Past Appointments
    const handleTogglePast = () => {
        setShowPastAppointments(!showPastAppointments);

    };
    useEffect(() => {
        const fetchAppointments = async () => {
          try {
            const res = await fetch("http://localhost:3000/api/admin/appointments", {
              headers: { Accept: "application/json" },
            });
    
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.message || `HTP ${res.status}`);
            }
    
            const data = await res.json();
            setPastAppointments(data.pastAppointments || []);
            setUpcomingAppointments(data.upcomingAppointments || []);
            setUpcomingAppointmentsCount(data.upcomingAppointments.length);
            setPastAppointmentsCount(data.pastAppointments.length);
          } catch (err) {
            console.error("❌ Error fetching appointments:", err);
            setError(err.message || "Failed to load appointments");
          }
        };
    
        fetchAppointments();
      }, []); 
    
    
const fakeData = [
    {
        name: "John Doe",
        time: "10:00 AM",
        date: "10/10/2025",
        service: "Low Taper $20",
        instagram: "john_doe",
        status: "Verified",
        bookingStatus: "Pending"
    },
    {
        name: "Jane Smith",
        time: "11:00 AM",   
        date: "10/10/2025",
        service: "Mid Fade $25",
        instagram: "janesmith",
        status: "Unverified",
        bookingStatus: "Approved"
    },
    {
        name: "Alex Lee",
        time: "12:00 PM",
        date: "10/10/2025",
        service: "High Fade $30",
        instagram: "alexlee",
        status: "Unverified",
        bookingStatus: "Pending"
    }
]
    return (
        <div className='flex flex-col bg-black m-8 mt-4 p-4 rounded-lg gap-4 border-1 border-white/20'>
            <div
                className="flex flex-row items-center gap-2 cursor-pointer"
                
            >
                <p className='text-2xl raleway-bold text-white'>Upcoming Appointments</p>
                <div className={AvailableTimeslotsStyle}>
                        <p>{upcomingAppointmentsCount}</p>
                    </div>
                <FaChevronDown
                    className={`text-white text-2xl transition-transform duration-200 ${showUpcomingAppointments ? 'rotate-90' : ''}`}
                    onClick={handleToggleUpcoming}
                />
                {showUpcomingAppointments && <input type="text" placeholder='Search' className='bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-1/4 focus:outline-none   ' />}
            </div>
            {showUpcomingAppointments && (
                <>
                    {upcomingAppointments.map((item, index) => (
                        <UpcomingAppointment key={index} name={item.name} time={item.time} date={item.date} service={item.service} instagram={item.instagram} bookingStatus={item.bookingStatus} status={item.status} />
                    ))}
                </>
            )}
            <div
                className="flex flex-row items-center gap-2 cursor-pointer"
                
            >
                <p className='text-2xl raleway-bold text-white'>Past Appointments</p>
                <div className={AvailableTimeslotsStyle}>
                        <p>{pastAppointmentsCount}</p>
                    </div>
                <FaChevronDown
                    className={`text-white text-2xl transition-transform duration-200 ${showPastAppointments ? 'rotate-90' : ''}`}
                    onClick={handleTogglePast}
                />
                {showPastAppointments && <input type="text" placeholder='Search' className='bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-1/4 focus:outline-none' />}
            </div>
            {showPastAppointments && (
                <>
                    {pastAppointments.map((item, index) => (
                        <PastAppointments key={index} name={item.name} time={item.time} date={item.date} service={item.service} instagram={item.instagram} bookingStatus={item.bookingStatus} status={item.status} />
                    ))}
                </>
            )}
            {error && <p className='text-red-500'>{error}</p>}
        </div>
    )
}