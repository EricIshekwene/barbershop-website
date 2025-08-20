import React from 'react'
import { useState, useCallback } from "react";
import AdminTitle from './admincomponents/AdminTitle'
import AdminSetAvailability from './admincomponents/AdminSetAvailability'
import AdminAppointments from './admincomponents/AdminAppointments'
import AdminClients from './AdminClients'

import Stats from './admincomponents/stats'
export default function AdminHome() {
  const [availabilityRefreshKey, setAvailabilityRefreshKey] = useState(0);
  const refreshAvailability = useCallback(
    () => setAvailabilityRefreshKey(k => k + 1),
    []
  );


  return (
    <div className='flex flex-col bg-black'>
      <AdminTitle />
      <AdminSetAvailability key={availabilityRefreshKey}  />
      <Stats />
      <AdminAppointments refreshAvailability={refreshAvailability}  />
      <AdminClients />

    </div>
  )
}