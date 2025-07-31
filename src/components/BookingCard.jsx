import React, { useState, useEffect } from "react";
import { IoMdCut } from "react-icons/io";
import { BsFillLightningChargeFill } from "react-icons/bs";

function BookingCard({ text, price, image, text2, price2, image2 }) {
    const [bookingOptions, setBookingOptions] = useState(null);

    useEffect(() => {
        console.log("bookingOptions changed:", bookingOptions);
    }, [bookingOptions]);
    return (
        <div className="flex flex-row justify-center items-center p-2 gap-3 mt-8">
            {/* Card 1 */}
            <div
                className={`rounded-lg border text-black shadow-sm cursor-pointer transition-all duration-300 w-80 sm:w-96 md:w-112 xl:w-128 h-48 sm:h-72 md:h-80 xl:h-96 overflow-hidden ${bookingOptions === "booking-card-1"
                    ? "bg-[#1c1808] ring-4 ring-[#DDCA7D]/30 shadow-lg"
                    : "bg-white hover:ring-2 hover:ring-[#DDCA7D]/50"
                    }`}
                style={{
                    borderColor: "#DDCA7D",
                    borderWidth: "1px",
                    borderStyle: "solid",
                }}
                onClick={() => setBookingOptions("booking-card-1")}
            >
                <div className="flex flex-col h-full justify-center items-center space-y-4 p-2 text-center relative">
                    {bookingOptions === "booking-card-1" && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#DDCA7D] rounded-full flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    )}

                    <div className="mx-auto mb-4 p-4 w-20 h-20 rounded-full bg-[#DDCA7D]/20 flex items-center justify-center">
                        <IoMdCut className={`w-full h-full ${bookingOptions === 'booking-card-1' ? 'text-[#DDCA7D]' : 'text-black'}`} />
                    </div>

                    <h3
                        className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold leading-none tracking-tight"
                        style={{ color: "#DDCA7D" }}
                    >
                        {text}
                    </h3>

                    <div
                        className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold"
                        style={{ color: "#DDCA7D" }}
                    >
                        {price}
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div
                className={`rounded-lg border text-black shadow-sm cursor-pointer transition-all duration-300 w-80 sm:w-96 md:w-112 xl:w-128 h-48 sm:h-72 md:h-80 xl:h-96 overflow-hidden ${bookingOptions === "booking-card-2"
                    ? "bg-[#1c1808] ring-4 ring-[#DDCA7D]/30 shadow-lg"
                    : "bg-white hover:ring-2 hover:ring-[#DDCA7D]/50"
                    }`}
                style={{
                    borderColor: "#DDCA7D",
                    borderWidth: "1px",
                    borderStyle: "solid",
                }}
                onClick={() => setBookingOptions("booking-card-2")}
            >
                <div className="flex flex-col h-full justify-center items-center space-y-4 p-2 text-center relative">
                    {bookingOptions === "booking-card-2" && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#DDCA7D] rounded-full flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    )}

                    <div className="mx-auto mb-4 p-4 w-20 h-20 rounded-full bg-[#DDCA7D]/20 flex items-center justify-center">
                        <BsFillLightningChargeFill className={`w-full h-full ${bookingOptions === 'booking-card-2' ? 'text-[#DDCA7D]' : 'text-black'}`} />
                    </div>
                    <h3
                        className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold leading-none tracking-tight"
                        style={{ color: "#DDCA7D" }}
                    >
                        {text2}
                    </h3>

                    <div
                        className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold"
                        style={{ color: "#DDCA7D" }}
                    >
                        {price2}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingCard;
