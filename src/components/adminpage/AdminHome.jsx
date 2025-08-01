import React from 'react'
import AdminTitle from './admincomponents/AdminTitle'
import AdminSetAvailability from './admincomponents/AdminSetAvailability'

export default function AdminHome() {
  return (
    <div className='flex flex-col bg-black  h-screen'>
        <AdminTitle />
        <AdminSetAvailability timeslots={[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]} />
    </div>
  )
}