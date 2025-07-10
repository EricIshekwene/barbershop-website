import React from 'react'
import image1 from '../assets/images.jpeg'

function HaircutExample() {
    return (
        <div className="flex flex-col items-center justify-center py-5 px-5 sm:px-10 md:px-16 sm:py-10 md:py-20   ">
            <div className="w-full  flex flex-wrap flex-row items-center justify-center  bg-gray-100">
                {/* Single Card */}
                <div className="flex flex-col items-center justify-center min-w-[160px] max-w-[500px] w-1/2 p-4">
                    <div
                        className="relative rounded-xl shadow-lg overflow-hidden border border-gray-200 w-full aspect-[3/4] bg-cover bg-center"
                        style={{ backgroundImage: `url(${image1})` }}
                    >
                        <div className="absolute bottom-5 left-5 text-white text-lg font-semibold px-2 py-1 rounded">
                            <p className="text-4xl montserrat-bold">low taper</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HaircutExample
