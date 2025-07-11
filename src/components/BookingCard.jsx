import React from "react";

function BookingCard({ text, price, image, description }) {
    return (
        <div
            className="rounded-lg border bg-white text-black shadow-sm cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-[#DDCA7D]/50 w-80 sm:w-96 md:w-112 xl:w-128 mx-auto mt-12 h-48 sm:h-72 md:h-80 xl:h-96 overflow-hidden"
            style={{ borderColor: '#DDCA7D', borderWidth: '3px' }}
        >
            <div className="flex flex-col h-full justify-center items-center space-y-4 p-2 text-center">
                <div className="mx-auto mb-4 p-2 rounded-full bg-[#DDCA7D]/20 w-fit">
                    {image && (
                        <img
                            src={image}
                            alt="booking"
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 xl:w-24 xl:h-24 object-cover rounded-full"
                        />
                    )}
                </div>
                <h3
                    className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold leading-none tracking-tight"
                    style={{ color: '#DDCA7D' }}
                >
                    {text}
                </h3>
                <p className="text-sm text-black/70">{description}</p>
                <div className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold" style={{ color: '#DDCA7D' }}>
                    {price}
                </div>
            </div>
        </div>

    );
}

export default BookingCard
