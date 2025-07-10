import React from 'react'
import square from '../assets/blacksquare.png'

function HaircutExample() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-10 bg-gray-100">
            <div className="w-full  flex flex-wrap flex-row items-center justify-center  bg-black">
                {/* Single Card */}
                <div className="flex flex-col items-center justify-center  min-w-[170px] max-w-[500px] w-1/2 p-4">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 w-full  aspect-[3/4]">
                        <img
                            src={square}
                            alt="Haircut Example"
                            className="object-cover w-full h-full"
                        />  
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center  min-w-[170px] max-w-[500px] w-1/2 p-4">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 w-full  aspect-[3/4]">
                        <img
                            src={square}
                            alt="Haircut Example"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center  min-w-[170px] max-w-[500px] w-1/2 p-4">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 w-full  aspect-[3/4]">
                        <img
                            src={square}
                            alt="Haircut Example"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HaircutExample
