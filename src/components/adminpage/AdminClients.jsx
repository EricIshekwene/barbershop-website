import React from 'react'
import AdminTitle from './admincomponents/AdminTitle'
import { FaChevronDown } from "react-icons/fa";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { MdEmail } from "react-icons/md";

const fakeClients = [
    {
        name: "John Doe",
        phone: "(555) 123-4567",
        email: "john.doe@email.com",
        instagram: "@johndoe",
        verified: true
    },
    {
        name: "Jane Smith",
        phone: "(555) 987-6543",
        email: "jane.smith@email.com",
        instagram: "@janesmith",
        verified: false
    },
    {
        name: "Carlos Rivera",
        phone: "(555) 222-3333",
        email: "carlos.rivera@email.com",
        instagram: "@carlosr",
        verified: true
    }
];

export default function AdminClients() {
    return (
        <div className='flex flex-col h-screen bg-black'>chevron
            <AdminTitle />
           
            <div className='flex flex-col bg-black m-8 mt-4 p-4 rounded-lg gap-4 border-1 border-white/20'>
                <div className='flex flex-row items-center gap-2'>
                    <p className='text-2xl raleway-bold text-white'>Clients</p> 
                    <FaChevronDown className='text-white text-2xl' />
                    <input type="text" placeholder='Search' className='bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-1/4' />
                   
                </div>
                <div className='flex flex-row bg-white/10 border border-white/20 rounded-lg p-4 gap-5 font-semibold text-[#DDCA7D] raleway-regular'>
                    <div className="w-7/40">Name</div>
                    <div className="w-7/40">Phone</div>
                    <div className="w-7/40">Email</div>
                    <div className="w-7/40">Instagram</div>
                    <div className="w-7/40">Verified</div>
                    <MdEmail className='text-white text-2xl' />
                </div>
                {fakeClients.map((client, idx) => (
                    <div 
                        key={idx}
                        className='flex flex-row bg-white/5 border border-white/10 rounded-lg p-4 gap-5 font-medium text-[#DDCA7D] raleway-regular items-center'
                    >
                        <div className="w-7/40">{client.name}</div>
                        <div className="w-7/40">{client.phone}</div>
                        <div className="w-7/40">{client.email}</div>
                        <div className="w-7/40">{client.instagram}</div>
                        <div className="w-7/40">
                            {client.verified ? (
                                <span className="text-green-400 font-bold">Yes</span>
                            ) : (
                                <span className="text-red-400 font-bold">No</span>
                            )}
                        </div>
                       
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-[#DDCA7D] bg-white/10 border border-white/20 rounded focus:ring-2 focus:ring-[#DDCA7D]/50 transition-all duration-200"
                        />
                        <MdModeEditOutline className='text-white text-2xl' />
                        <MdDelete className='text-red-500 text-2xl' />

                    </div>
                ))}
            </div>
        </div>
    )
}