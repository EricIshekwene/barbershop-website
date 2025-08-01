import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'
import AdminHome from './components/adminpage/AdminHome'
import AdminClients from './components/adminpage/AdminClients'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/clients" element={<AdminClients />} />
    </Routes>
  )
}

export default App
