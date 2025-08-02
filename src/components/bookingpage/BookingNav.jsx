import React from 'react';

function BookingNav({ logo, text }) {
  return (
    <nav className="bg-black">
      <div className="flex justify-between max-w-8xl mx-auto py-2 px-4 sm:px-10 md:px-16 lg:px-20 xl:px-32">
        <div className="flex items-center">
          <p className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold montserrat-navbar-btn text-white px-4 py-2 rounded-md">
            Book Your Cut
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="/"
            className="relative inline-flex items-center justify-center px-5 py-1.5 rounded-lg text-sm sm:text-sm md:text-md xl:text-md font-bold montserrat-navbar-btn transition-colors duration-200 bg-transparent border border-[#DDCA7D] text-[#DDCA7D] hover:bg-[#DDCA7D]/10 focus:outline-none "
          >
            Home
          </a>
          
        </div>
      </div>

      <hr className="w-11/12 mx-auto border-t-2 border-[#DDCA7D] bg-transparent" />
    </nav>
  );
}

export default BookingNav;
