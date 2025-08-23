import React, { useState, useCallback } from "react";
import AdminTitle from './admincomponents/AdminTitle';
import AdminSetAvailability from './admincomponents/AdminSetAvailability';
import AdminAppointments from './admincomponents/AdminAppointments';
import AdminClients from './AdminClients';
import Stats from './admincomponents/stats';
import EmergencyAppointments from './admincomponents/EmergencyAppointments';
export default function AdminHome() {


  

  return (
    <div className='flex flex-col bg-black'>
      <AdminTitle />
     
      <AdminSetAvailability  />
      <Stats />
      <AdminAppointments
      />
      <EmergencyAppointments
      />
      <AdminClients
      />
      
    </div>
  );
}
