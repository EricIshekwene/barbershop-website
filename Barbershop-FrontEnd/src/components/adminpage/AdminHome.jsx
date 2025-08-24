import React, { useState, useCallback } from "react";
import AdminTitle from './admincomponents/AdminTitle';
import AdminSetAvailability from './admincomponents/AdminSetAvailability';
import AdminAppointments from './admincomponents/AdminAppointments';
import AdminClients from './AdminClients';
import DashboardStats from './admincomponents/DashboardStats';
import EmergencyAppointments from './admincomponents/EmergencyAppointments';
export default function AdminHome() {

  return (
    <div className='flex flex-col bg-black'>
      <AdminTitle />
     
      <AdminSetAvailability  />
      <DashboardStats />
      <AdminAppointments
      />
      <EmergencyAppointments 
      />
      <AdminClients
      />
      
    </div>
  );
}
