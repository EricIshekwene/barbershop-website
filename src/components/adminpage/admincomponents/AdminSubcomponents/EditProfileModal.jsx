import React from 'react'
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { useState } from 'react';
export default function EditProfileModal() {
  const [client, setClient] = useState({
    name: "John Doe",
    phone: "1234567890",
    email: "john.doe@example.com",
    status: "Verified",
    instagram: "john_doe",
    pastAppointments: [
      {
        date: "2023-12-01",
        time: "09:00",
        service: "Buzz Cut",
        price: "$15"
      },
      {
        date: "2023-11-15",
        time: "14:30",
        service: "Beard Trim",
        price: "$8"
      },
      {
        date: "2023-10-20",
        time: "16:00",
        service: "Haircut & Style",
        price: "$25"
      },
      {
        date: "2023-09-05",
        time: "11:15",
        service: "Shave",
        price: "$12"
      },
      {
        date: "2023-08-22",
        time: "13:45",
        service: "Fade",
        price: "$20"
      }
    ]

  });
  const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
  const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
  const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
  const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none "

  return (
    <div className='bg-white/10 border border-white/20 rounded-lg p-4 w-1/2'>
      <div className=' flex flex-col justify-center '>
        <div className='flex flex-row items-center gap-2 self-center'>
          <p className='text-white self-center raleway-bold text-2xl'>Editing {client.name}</p>
          {client.status === "Verified" ? <button className={UpdateTimeslotsStyle} >  <TiTick className='text-green-300 text-xl'/> </button>: <button className={UnavailableVerifiedTimeslotsStyle} >  <ImCross className='text-red-300 text-xl'/> </button> }
        </div>
        <div className='flex flex-row justify-between items-center gap-2'>
          <div className='flex flex-col justify-between items-start w-1/2'>
            <input type="text" placeholder='Name'
              className='bg-white/10 text-[#DDCA7D] focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full m-4' />
            <input type="text" placeholder='Phone'
              className='bg-white/10 text-[#DDCA7D] focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full m-4' />
            <input type="text" placeholder='Email'
              className='bg-white/10 text-[#DDCA7D] focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full m-4' />
            <input type="text" placeholder='Instagram'
              className='bg-white/10 text-[#DDCA7D] focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full m-4' />
          </div>
          <div className='flex flex-col items-start w-1/2'>
            <div className='flex self-center flex-row border border-white/20 rounded-lg p-2 bg-white/10 justify-between items-center gap-2'>
              <p className='text-[#DDCA7D] raleway-regular text-sm'>Past Appointments</p>

            </div>
            <div className='flex flex-col justify-center items-center w-full'>
            <div className='flex flex-col mt-2 border border-white/20 rounded-lg p-2 bg-white/10 justify-between items-start gap-2 '>
              {client.pastAppointments ? client.pastAppointments.map((appointment, index) => (
                <div key={index} className='flex flex-row justify-between items-center gap-2'>
                  <p className='text-[#DDCA7D] raleway-regular text-sm'>{appointment.date}</p>
                </div>
                )) : <p className='text-[#DDCA7D] raleway-regular text-sm'>No past appointments</p>}
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-row justify-end items-center gap-4 w-full'>
          <button className={UnavailableUnverifiedTimeslotsStyle}
          onClick={() => {
            client.status === "Verified" ? setClient({ ...client, status: "Unverified" }) : setClient({ ...client, status: "Verified" });
          }}
          >{client.status === "Verified" ? "Unverify" : "Verify"}</button>
          <button className={UnavailableVerifiedTimeslotsStyle}>Close</button>
          <button className={UpdateTimeslotsStyle}>Update</button>
        </div>
      </div>

    </div>
  )
}   