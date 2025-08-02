import React from 'react'
import AdminTitle from './admincomponents/AdminTitle'
import AdminSetAvailability from './admincomponents/AdminSetAvailability'
import AdminAppointments from './admincomponents/AdminAppointments'
import AdminClients from './AdminClients'
import MailModal from './admincomponents/AdminSubcomponents/MailModal'
import EditProfileModal from './admincomponents/AdminSubcomponents/EditProfileModal'
import CancelAppointment from './admincomponents/AdminSubcomponents/CancelAppointment'
import VerifyModal from './admincomponents/AdminSubcomponents/VerifyModal'

export default function AdminHome() {
  
    
  
  return (
    <div className='flex flex-col bg-black'>
        <AdminSetAvailability />
        <AdminAppointments />
        <AdminClients />
        <MailModal />
        <EditProfileModal />
        <CancelAppointment />
        <VerifyModal />
    </div>
  )
}