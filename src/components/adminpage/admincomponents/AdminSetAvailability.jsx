import React, { useState } from 'react'
import { DayPicker, } from 'react-day-picker'

export default function AdminSetAvailability({timeslots}) {
    const [selected, setSelected] = useState(null);
    
    const AvailableTimeslotsStyle ="px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle ="px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 cursor-not-allowed opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle ="px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
    return (
        <div className="flex border-1 border-white/20 m-8 p-4 rounded-lg gap-4">
            <div
                className={`rounded-lg border flex flex-col items-center border-white/20  w-80 sm:w-96 p-4 bg-white/10 ring-4`}
            >

                <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={(date) => {
                        setSelected(date)

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

                <p className="text-center text-[#1c1808] mt-4 font-medium">
                    {selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."}
                </p>
            </div>
            <div className='flex flex-col items-center p-4 flex-1'>
                <p className='text-2xl raleway-bold text-white'>Timeslots</p>
                <div className='flex flex-row flex-wrap items-center p-2 justify-start'>
                    {timeslots && timeslots.length > 0 && timeslots.map((timeslot, idx) => (
                        <div key={idx} className='flex items-center justify-start p-2'>   
                            <button
                                className={AvailableTimeslotsStyle}
                                style={{ minWidth: '6rem', minHeight: '2rem' }}
                            >
                                {timeslot}:00
                            </button>
                        </div>
                    ))}
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
            </div>
        </div>
    )
}