import React, { useState } from 'react'
import { DayPicker } from 'react-day-picker'

export default function AdminSetAvailability({ }) {
    // Removed unused 'selected' state
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);

    const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
    const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn  bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-1"
    const MockTimeslots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    const [selectedDate, setSelectedDate] = useState(null);

    // Move MockAvailability above where it's used
    const [availability, setAvailability] = useState([
        {
          date: "2025-08-04",
          timeslots: [{ time: 6, status: "unavailable" },
            { time: 7, status: "available" },
            { time: 8, status: "available" },
            { time: 9, status: "available" },
            { time: 10, status: "unavailable" },
            { time: 11, status: "available" },
            { time: 12, status: "available" },
            { time: 13, status: "available" },
            { time: 14, status: "available" },
            { time: 15, status: "available" },
            { time: 16, status: "available" },
            { time: 17, status: "available" },
            { time: 18, status: "available" },
            { time: 19, status: "available" },
            { time: 20, status: "available" },
            { time: 21, status: "available" },]
        }
      ])

    let selectedDateStr = null;
    if (selectedDate instanceof Date && !isNaN(selectedDate)) {
        selectedDateStr = selectedDate.toISOString().split('T')[0];
    }
    const selectedDay = selectedDateStr
        ? availability.find(item => item.date === selectedDateStr)
        : null;

    const handleUpdateClick = () => {
        if (!selectedDateStr) return;
        
        const updatedDay = availability.find(item => item.date === selectedDateStr);

        if (updatedDay) {
          // 🧠 Save the updated day's availability — replace this with real logic
          console.log("Saving availability for:", updatedDay.date);
          console.log("Timeslots:", updatedDay.timeslots);
      
          // TODO: Send to backend API or local storage
          // fetch("/api/saveAvailability", { method: "POST", body: JSON.stringify(updatedDay) })
        }
      

        
        setIsUpdateDisabled(true);
        setTimeout(() => {
            setIsUpdateDisabled(false);
        }, 10000);
        // Place your update logic here if needed

    };

    return (
        <div className="flex border-1 border-white/20 m-8 p-4 rounded-lg gap-4">
            <div
                className={`rounded-lg border flex flex-col items-center border-white/20  w-80 sm:w-96 p-4 bg-white/10 ring-4`}
            >
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                        // Defensive: Only set if date is a valid Date
                        if (date instanceof Date && !isNaN(date)) {
                            setSelectedDate(date);
                        } else {
                            setSelectedDate(null);
                        }
                    }}
                    navLayout='around'
                    required
                    disabled={[
                        { before: new Date() },
                        { dayOfWeek: [0, 6] },
                        { after: new Date(new Date().setDate(new Date().getDate() + 14)) },
                    ]}
                    classNames={{
                        root: 'rdp-root text-white raleway-regular',
                        selected: 'bg-[#DDCA7D] text-black rounded-full',
                        today: 'text-[#DDCA7D] font-bold',
                        chevron: `fill-[#DDCA7D]`
                    }}
                />

                <p className="text-center text-white mt-4 font-medium">
                    {selectedDate instanceof Date && !isNaN(selectedDate)
                        ? `Selected: ${selectedDate.toLocaleDateString()}`
                        : "Pick a day."}
                </p>
            </div>
            <div className='flex flex-col items-center p-4 flex-1'>
                <p className='text-2xl raleway-bold text-white'>Timeslots</p>
                {/*<div className='flex flex-row flex-wrap items-center p-2 justify-start'>
                    {MockTimeslots && MockTimeslots.length > 0 && MockTimeslots.map((timeslot, idx) => (
                        <div key={idx} className='flex items-center justify-start p-2'>   
                            <button
                                className={AvailableTimeslotsStyle}
                                style={{ minWidth: '6rem', minHeight: '2rem' }}
                            >
                                {timeslot}:00
                            </button>
                        </div>
                    ))}
                </div>*/}
                <div className='flex flex-row flex-wrap items-center p-2 justify-start'>
                    {selectedDay ? (
                        selectedDay.timeslots.map((timeslot, idx) => (
                            <div key={idx} className="flex items-center justify-start p-2">
                                <button
                                    className={
                                        timeslot.status === "available"
                                            ? AvailableTimeslotsStyle
                                            : timeslot.status === "unavailable"
                                                ? UnavailableVerifiedTimeslotsStyle
                                                : UnavailableUnverifiedTimeslotsStyle
                                    }
                                    style={{ minWidth: "6rem", minHeight: "2rem" }}
                                    onClick={() => {
                                        // Update the status of the clicked timeslot
                                        const updatedTimeslots = selectedDay.timeslots.map(slot =>
                                            slot.time === timeslot.time
                                              ? {
                                                  ...slot,
                                                  status: slot.status === "available" ? "unavailable" : "available"
                                                }
                                              : slot
                                          );
                                          
                                        setAvailability(prev =>
                                            prev.map(item =>
                                              item.date === selectedDateStr
                                                ? { ...item, timeslots: updatedTimeslots }
                                                : item
                                            )
                                          );
                                    }}
                                >
                                    {timeslot.time}:00
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-white mt-4">No timeslots for the day.</p>
                    )}
                </div>
                <div className='flex flex-row flex-wrap items-center p-2 justify-start self-start'>

                    <div className='flex items-center p-2'>
                        <button
                            className={AvailableTimeslotsStyle}
                            style={{ minWidth: '6rem', minHeight: '2rem' }}
                        >
                            Available
                        </button>
                    </div>
                    <div className='flex items-center p-2'>
                        <button
                            className={UnavailableVerifiedTimeslotsStyle}
                            style={{ minWidth: '6rem', minHeight: '2rem' }}
                        >
                            Unavailable
                        </button>
                    </div>
                    <div className='flex items-center p-2'>
                        <button
                            className={UnavailableUnverifiedTimeslotsStyle}
                            style={{ minWidth: '6rem', minHeight: '2rem' }}
                        >
                            Unverified
                        </button>
                    </div>
                </div>
                <div className='flex items-center justify-start p-2 self-start'>
                    <div className='flex items-center p-2'>
                        <button
                            className={isUpdateDisabled ? UnavailableVerifiedTimeslotsStyle : UpdateTimeslotsStyle}
                            style={{ minWidth: '6rem', minHeight: '2rem' }}
                            onClick={() => {
                                handleUpdateClick();
                                
                            }}
                            disabled={isUpdateDisabled}
                        >
                            {isUpdateDisabled ? "Wait..." : "Update"}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}