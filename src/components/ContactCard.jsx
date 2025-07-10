import React from 'react'
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import image1 from '../assets/images.jpeg'

function ContactCard() {
    return (
        <div className="flex flex-col items-center justify-center bg-black">
            <div className="flex flex-col items-center justify-center min-w-[260px] max-w-[800px] w-1/2 p-4 ">
                <div className="relative rounded-xl shadow-lg overflow-hidden border border-gray-200 w-full aspect-[3/4] bg-white">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-xl sm:text-xl md:text-xl xl:text-4xl raleway-bold">Contact Us</p>
                    </div>
                    <hr className="w-full border-t-2 border-gray-300 " />
                </div>
            </div>
        </div>
    )
}

export default ContactCard 