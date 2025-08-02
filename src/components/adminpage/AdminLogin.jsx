import React from 'react' 
import { MdLogin } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
export default function AdminLogin() {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col bg-black items-center justify-center h-screen gap-4'>
            
            <MdLogin className='text-6xl text-[#DDCA7D]' />
            <form className='flex flex-col items-center justify-center gap-4'>
                <input type="text" placeholder='Email' className='bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-1/4' />
                <input type="password" placeholder='Password' className='bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-1/4' />
                <button className='bg-[#DDCA7D] raleway-bold text-[#1c1808] px-13 py-4 rounded-lg text-lg font-medium uppercase tracking-wide shadow-lg transition-all duration-500 transform hover:scale-105 flex items-center gap-2'
                onClick={() => navigate('/admin')}>Login</button>
            </form>
        </div>
    )
}