import React, { useState } from 'react';

export default function BookingForm({service, date, time}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [instagram, setInstagram] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, email, phone, instagram, date, time, service);
    }
    return (
        <div className="w-1/4  min-w-[320px] p-2 mt-6 mx-auto rounded-xl border-1 border-[#DDCA7D]">

            <div className="flex flex-col ml-5 mr-5">
                <p className="text-white raleway-bold text-left text-2xl mt-5 font-bold">Booking Form</p>
                <p className="text-white raleway-regular text-left text-sm font-bold">Complete the your booking details</p>
            </div>

            <form className="flex flex-col ml-1 mr-5 mt-2 gap-4 rounded-xl" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-[#DDCA7D] text-white bg-[#1c1c1c] focus:outline-none focus:ring-0"
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-[#DDCA7D] text-white bg-[#1c1c1c] focus:outline-none focus:ring-0"
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-[#DDCA7D] text-white bg-[#1c1c1c] focus:outline-none focus:ring-0"
                />
                <input
                    type="text"
                    placeholder="Instagram"
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-[#DDCA7D] text-white bg-[#1c1c1c] focus:outline-none focus:ring-0"
                />
                
                <p className="text-white raleway-regular text-left text-sm font-bold">Enter your instagram to become a verified customer</p>
                <button type="submit" className="w-full p-2 m-2 rounded-md border-2 border-[#DDCA7D] text-white bg-[#1c1c1c]">Submit</button>
            </form>
        </div>
    )
}