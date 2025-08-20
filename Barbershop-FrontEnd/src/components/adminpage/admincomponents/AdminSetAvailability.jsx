import React, { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import toast from 'react-hot-toast';

export default function AdminSetAvailability({ }) {
    const [data, setData] = useState(null);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle ="px-4 py-2 rounded-xl text-sm font-medium montserrat-navbar-btn bg-amber-200/10 backdrop-blur-sm border border-amber-200/30 text-amber-200 hover:bg-amber-200/15 hover:border-amber-200/40 hover:shadow-sm transition-all duration-300 focus:outline-none";
    const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn  bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none "
    //const MockTimeslots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]




    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:3000/api/admin/getAvailability', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            if (data) {
                setAvailability(data);
                console.log(data);
            } else {
                setErrorMessage("Error fetching availability");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }
        }
        fetchData();
    }, []);



    let selectedDateStr = null;
    if (selectedDate instanceof Date && !isNaN(selectedDate)) {
        selectedDateStr = selectedDate.toLocaleDateString('en-CA', {
            timeZone: 'America/New_York',
        });
    }
    const selectedDay = selectedDateStr
        ? availability.find(item => item.date === selectedDateStr)
        : null;

    const handleUpdateClick = async () => {
        if (!selectedDateStr) return;

        const updatedDay = availability.find(item => item.date === selectedDateStr);

        if (!updatedDay) return;

        try {
            const res = await fetch('http://localhost:3000/api/admin/updateAvailability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedDay),
            });

            if (res.ok) {
                //reload page
                toast.success("Successfully updated availability");

            } else {
                //HANDLE ERROR
                //this error is when the data is not updated in the backend for the timeslots
                setErrorMessage("Error updating availability");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }

            const responseData = await res.json();
            console.log("✅ Update successful:", responseData);

        } catch (err) {
            console.error("❌ Update failed:", err);
            setErrorMessage("Error updating availability");
            setTimeout(() => {
                setErrorMessage("");
            }, 1000);
        }

        setIsUpdateDisabled(true);
        setTimeout(() => {
            setIsUpdateDisabled(false);
        }, 10000);
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
                                            : timeslot.status === "booked"
                                                ? `${UnavailableVerifiedTimeslotsStyle} cursor-not-allowed opacity-60`
                                                : UnavailableUnverifiedTimeslotsStyle
                                    }
                                    style={{ minWidth: "6rem", minHeight: "2rem" }}
                                    disabled={timeslot.status === "booked"}
                                    onClick={() => {
                                        // If booked, do nothing (blocked in UI)
                                        if (timeslot.status === "booked") return;

                                        // Toggle only between available/unavailable
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
                                    title={
                                        timeslot.status === "booked"
                                            ? "Booked – cannot change"
                                            : timeslot.status === "available"
                                                ? "Click to close"
                                                : "Click to open"
                                    }
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
                            Booked
                        </button>
                    </div>
                    <div className='flex items-center p-2'>
                        <button
                            className={UnavailableUnverifiedTimeslotsStyle}
                            style={{ minWidth: '6rem', minHeight: '2rem' }}
                        >
                            Unavailable
                        </button>
                    </div>
                    {errorMessage && <div className='flex items-center p-2'>
                        <button
                            className={UnavailableVerifiedTimeslotsStyle}
                            style={{ minWidth: '6rem', minHeight: '2rem' }}
                        >
                            {errorMessage}
                        </button>
                    </div>}
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