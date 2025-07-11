import React from 'react'

function BookingNav({ logo, text }) {
    return (
        <nav className="bg-black">
            <div className="flex justify-between max-w-8xl py-4 mx-auto p-4">

                <div className="flex items-center ">
                    <p className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl hurricane-regular text-white px-4 py-2 rounded-md">
                        Book Your Cut
                    </p>
                </div>

                <div className="flex items-center px-4 sm:px-10 md:px-16 lg:px-20 xl:px-32">
                    <a
                        href="/"
                        className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl hurricane-regular text-black bg-white px-4 py-2 rounded-md"
                    >
                        Home
                    </a>
                </div>
                
            </div>
            <hr className="w-7/8 mx-auto border-t-2 border-gray-300"/>
        </nav>
    )
}

export default BookingNav
