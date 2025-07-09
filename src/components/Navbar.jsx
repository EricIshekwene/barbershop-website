import React from 'react'

function Navbar({ logo }) {
  return (
    <nav className="bg-black shadow-md">
      <div className="flex justify-between max-w-8xl mx-auto p-4 px-2">

        <div className="flex items-center">
          {logo && <img src={logo} alt="logo" className="h-10" />}
        </div>
        <div className="flex items-center">
          <a href="#" className="bg-white text-black px-4 py-2 rounded-md">Booking</a>
          <a href="#" className="text-white px-4">About Us</a>
          <a href="#" className="text-white px-4">Contact Us</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;