import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import '../../App.css'
import { useEffect } from 'react';

function BookingCalendar({setDate, setTime}) {
    const numbers = [10,11,12,13,14,15,16,17,18,19,20];
    const [availability, setAvailability] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [selected, setSelected] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedTime, setSelectedTime] = useState(null);
    const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
    const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn  bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none "
    
    useEffect(() => {
        const fetchAvailability = async () => {
            try{
            const res = await fetch('http://localhost:3000/api/admin/getAvailability', {
                method: 'GET',
                credentials: 'include',
            });                             
            if(res.ok){
                const data = await res.json();
                setAvailability(data); 
                console.log("data", data);
                const datesWithAvailability = data.filter(day => day.timeslots.some(slot => slot.status === "available")).map(day => new Date(day.date));
                setAvailableDates(datesWithAvailability); 
                console.log("datesWithAvailability", datesWithAvailability);
            }else{
                setErrorMessage("Db connected butError fetching availability");
            }
            
            
            }catch(err){
                setErrorMessage("db not connected Error fetching availability");
            }
        }
        fetchAvailability();
    }, []);

    return (
        <div className="flex justify-center m-8">
            <div
                className={`rounded-lg border flex flex-col items-center border-white/20 w-80 sm:w-96 p-4 bg-white/10 ring-4`}
            >

                <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={(date) => {
                        setSelected(date)
                        setDate(date.toISOString().split('T')[0]);
                    }}
                    navLayout='around'
                    required
                    disabled={[
                        { before: new Date() },     
                        { dayOfWeek: [0, 6] },
                        { after: new Date(new Date().setDate(new Date().getDate() + 7)) },
                      ]}
                    
                    classNames={{
                        root: 'rdp-root text-white raleway-regular',
                        selected: 'bg-[#DDCA7D] text-black rounded-full',
                        today: 'text-[#DDCA7D] font-bold',
                        chevron: `fill-[#DDCA7D]`
                        
                    }}
                />
                {errorMessage && <p className={UnavailableVerifiedTimeslotsStyle}>{errorMessage}</p>}
                <p className="text-center text-white mt-4 font-medium">
                    {selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."}
                </p>
                <div className="flex gap-2 p-4 flex-wrap flex-row items-center justify-center">
  {(() => {
    const selectedDateStr = selected?.toISOString()?.split('T')[0];
    const selectedDay = availability?.find(day => day.date === selectedDateStr);
    const availableTimes = selectedDay?.timeslots
      .filter(slot => slot.status === "available")
      .map(slot => slot.time) || [];

    return availableTimes.length > 0 ? (
      availableTimes.map((hour, idx) => (
        <p
          key={idx}
          className={`${selectedTime === hour ? UpdateTimeslotsStyle : AvailableTimeslotsStyle}`}
          onClick={() => {
            setSelectedTime(hour);
            setTime(hour);
          }}
        >
          {hour}:00
        </p>
      ))
    ) : (
      <p className={UnavailableUnverifiedTimeslotsStyle}>No available times for this day</p>
    );
  })()}
</div>
            </div>
        </div>
    );
}

export default BookingCalendar;
