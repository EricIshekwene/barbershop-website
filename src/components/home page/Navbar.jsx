import React from 'react'

function Navbar({ logo }) {
  return (
    <nav className="bg-black ">
      <div className="flex justify-between max-w-8xl mx-auto p-1 px-2 py-2">

        <div className="flex items-center px-10 ">
          {logo && <img src={logo} alt="logo" className="h-10" />}
        </div>
        <div className="flex items-center px-4 sm:px-10 md:px-16 lg:px-20 xl:px-32">
          <div className="flex space-x-4">
            <a
              href="#"
              className="relative inline-flex items-center  justify-center px-5  py-1.5  mr-3 rounded-lg text-sm sm:text-sm md:text-md xl:text-md font-bold montserrat-navbar-btn transition-colors duration-200 bg-transparent border border-[#DDCA7D] text-[#DDCA7D] hover:bg-[#DDCA7D]/10 focus:outline-none focus:ring-2 focus:ring-[#DDCA7D] focus:ring-offset-2"
            >
              About
            </a>
            <a
              href="#"
              className="relative inline-flex items-center justify-center px-5 py-1.5  mr-3 rounded-lg text-sm sm:text-sm md:text-md xl:text-md font-bold montserrat-navbar-btn transition-colors duration-200 bg-transparent border border-[#DDCA7D] text-[#DDCA7D] hover:bg-[#DDCA7D]/10 focus:outline-none focus:ring-2 focus:ring-[#DDCA7D] focus:ring-offset-2"
            >
              Contact
            </a>
            <a
              href="/booking"
              className="hidden md:inline-flex items-center justify-center px-5 py-1.5 rounded-lg text-sm sm:text-sm md:text-md xl:text-md font-bold montserrat-navbar-btn transition-colors duration-200 bg-[#DDCA7D] text-black hover:bg-[#c7b86e] focus:outline-none focus:ring-2 focus:ring-[#DDCA7D] focus:ring-offset-2 shadow-sm"
            >
              Booking
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;