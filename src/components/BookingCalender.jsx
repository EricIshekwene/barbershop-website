import React, { useState } from 'react'
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

function BookingCalender() {
    const [selected, setSelected] = useState(null);

    return (
        <>
            <div className="flex w-1/2 flex-row justify-center items-center p-2 gap-3 mt-8 w-full">
                <DayPicker
                    animate
                    mode="single"
                    selected={selected}
                    onSelect={setSelected}
                    footer={
                        selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
                    }
                />
            </div>
        </>
    )
}

export default BookingCalender