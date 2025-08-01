import React from 'react'
import AdminTitle from './admincomponents/AdminTitle'
import AdminSetAvailability from './admincomponents/AdminSetAvailability'
import AdminAppointments from './admincomponents/AdminAppointments'

export default function AdminHome() {
  
    
  
  return (
    <div className='flex flex-col bg-black'>
        <AdminTitle />
        <AdminSetAvailability />
        <AdminAppointments />
    </div>
  )
}