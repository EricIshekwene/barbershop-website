import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BookingPage from './pages/BookingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<BookingPage />} />
    </Routes>
  )
}

export default App
