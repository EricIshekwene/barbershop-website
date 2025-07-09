import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import HomeCard from './components/HomeCard'
import BookYourAppointment from './components/BookYourAppointment'

function App() {
  return (
    <>
      <Navbar logo={reactLogo} />
      
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center gap-10">
          <HomeCard />
          <BookYourAppointment />
        </div>
      </div>
    </>
  )
}

export default App
