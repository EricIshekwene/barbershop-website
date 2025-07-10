import React from 'react'

function BookingNav({ logo, text }) {
    return (
        <nav className="bg-black">
            <div className="flex justify-between max-w-8xl py-10 mx-auto p-4 px-2">

                <div className="flex items-center px-10">
                    {logo && <img src={logo} alt="logo" className="h-10" />}
                </div>
                <div className="flex items-center px-4 sm:px-10 md:px-16 lg:px-20 xl:px-32">
                    <a
                        href="#"
                        className="text-xl sm:text-2xl md:text-3xl xl:text-4xl hurricane-regular text-white px-4 py-2 rounded-md transition-all duration-500 transform hover:scale-105 "
                        style={{
                            backgroundImage: 'linear-gradient(to right, #1e130c 0%, #9a8478 51%, #1e130c 100%)',
                            backgroundSize: '200% auto',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundPosition = 'right center';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundPosition = 'left center';
                        }}
                    >
                        Booking
                    </a>
                    <a href="#" className="text-xl sm:text-2xl md:text-3xl xl:text-4xl hurricane-regular text-white px-4">About</a>
                    <a href="#" className="text-xl sm:text-2xl md:text-3xl xl:text-4xl hurricane-regular text-white px-4">Contact</a>
                </div>
            </div>
        </nav>
    )
}

export default BookingNav;