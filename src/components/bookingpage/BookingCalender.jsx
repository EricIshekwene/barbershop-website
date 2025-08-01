import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import '../../App.css'


function BookingCalendar({setDate}) {
    const [selected, setSelected] = useState(null);

    return (
        <div className="flex justify-center m-8">
            <div
                className={`rounded-lg border flex flex-col items-center  w-80 sm:w-96 p-4 bg-white ring-4`}
            >

                <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={(date) => {
                        setSelected(date)
                        setDate(date.toLocaleDateString())
                    }}
                    navLayout='around'
                    required
                    disabled={[
                        { before: new Date() },     
                        { dayOfWeek: [0, 6] },
                        { after: new Date(new Date().setDate(new Date().getDate() + 7)) },
                      ]}
                    
                    classNames={{
                        root: 'rdp-root raleway-regular',
                        selected: 'bg-[#1c1808] text-[#DDCA7D] rounded-full',
                        today: 'text-[#DDCA7D] font-bold',
                        chevron: 'text-[#DDCA7D]',
                        
                    }}
                />
                
                <p className="text-center text-[#1c1808] mt-4 font-medium">
                    {selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."}
                </p>
            </div>
        </div>
    );
}

export default BookingCalendar;
