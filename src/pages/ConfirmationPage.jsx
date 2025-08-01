import React from 'react'
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { TiTick } from "react-icons/ti";
import { RxCross1 } from "react-icons/rx";


export default function ConfirmationPage() {
    const navigate = useNavigate(); 
    return (
        <div className='flex flex-col bg-black items-center justify-center h-screen gap-4'>
            <h1 className='text-3xl raleway-regular text-[#DDCA7D] text-center'>Email Sent</h1>
            <MdOutlineMarkEmailRead className='text-6xl text-[#DDCA7D]' />
            <p className='text-sm text-white text-center raleway-regular'>Please check your email for the confirmation link</p>
            {/* 
            <button className='bg-[#DDCA7D] raleway-bold text-[#1c1808] px-13 py-4 rounded-lg text-lg font-medium uppercase tracking-wide shadow-lg transition-all duration-500 transform hover:scale-105 flex items-center gap-2'>
            <div className='flex gap-10 flex-row'>
            <TiTick className='text-6xl ' />
            <div className='flex items-center gap-2 flex-col'>
            <p className='text-2xl'>All Good!</p>
              <p className='text-xs'>Back to Home</p>
            </div>
            </div>
            </button>
            <button className='bg-[#1c1808] raleway-bold text-[#DDCA7D] px-6 py-4 rounded-lg text-lg font-medium uppercase tracking-wide shadow-lg transition-all duration-500 transform hover:scale-105 flex items-center gap-2'>
                <div className='flex gap-10 flex-row'>
                  <RxCross1 className='text-6xl' />
                  <div className='flex items-center gap-2 flex-col'>
                    <p className='text-xl'>Didn't get the email?</p>
                    <p className='text-xs'>Back to Form</p>
                  </div>
                </div>
            </button> 
            */}
             <button className='bg-[#DDCA7D] raleway-bold text-[#1c1808] px-26 py-4 rounded-lg text-lg font-medium uppercase
             tracking-wide shadow-lg transition-all duration-500 transform hover:scale-105 flex items-center gap-2'
             onClick={() => navigate('/')}>
            <div className='flex items-center gap-2 flex-col'>
            <div className='flex gap-2 flex-row'> <TiTick className='text-2xl ' /> All Good!</div>
            <p className='text-xs'>Back to Home</p>
            </div>
            </button>
            <button className='bg-[#1c1808] raleway-bold text-[#DDCA7D] px-12 py-4 rounded-lg text-lg font-medium
            uppercase tracking-wide shadow-lg transition-all duration-500 transform hover:scale-105 flex items-center gap-2'
            onClick={() => navigate('/booking')}>
                <div className='flex items-center gap-2 flex-col'>
                <div className='flex gap-2 flex-row'><RxCross1 className='text-2xl' /> Didn't get the email?</div>
                <p className='text-xs'>Back to Form</p>
                </div>
            </button> 
           
        </div>
    )
}