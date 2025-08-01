import React from 'react'
import AdminTitle from './admincomponents/AdminTitle'
import AdminSetAvailability from './admincomponents/AdminSetAvailability'

export default function AdminHome() {
  const Availability = [
    {
      date: "2025-08-04",
      timeslots: [
        { time: 9, status: "available" },
        { time: 10, status: "booked" },
        { time: 11, status: "unverified" },
       
      ]
    },
    {
      date: "2025-08-05",
      timeslots: [
        { time: 12, status: "available" },
        { time: 13, status: "available" }
      ]
    },
    {
      date: "2025-08-06",
      timeslots: [
        { time: 14, status: "available" },
        { time: 15, status: "available" }
      ]
    },
    {
      date: "2025-08-07",
      timeslots: [
        { time: 16, status: "available" },
        { time: 17, status: "available" }
      ]
    }
  ];
    
  
  return (
    <div className='flex flex-col bg-black  h-screen'>
        <AdminTitle />
        <AdminSetAvailability timeslots={[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]} />
    </div>
  )
}