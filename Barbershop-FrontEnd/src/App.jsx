import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'   // ⬅️ add this
import './App.css'
import Home from './pages/Home'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'
import AdminHome from './components/adminpage/AdminHome'
import AdminClients from './components/adminpage/AdminClients'
import AdminLogin from './components/adminpage/AdminLogin'
import Confirmed from './pages/Confirmed'
import EmergencyConfirmed from './pages/EmergencyConfirmed'

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 2500,
          style: {
            background: 'rgba(0,0,0,0.85)',
            color: '#DDCA7D',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(6px)',
            borderRadius: '12px',
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 600
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#000' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#000' } },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/confirmed" element={<Confirmed />} />
        <Route path="/emergency-confirmation" element={<EmergencyConfirmed />} />
      </Routes>
    </>
  )
}

export default App
