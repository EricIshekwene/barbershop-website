import React from 'react'
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

function HomeCard() {
  return (
    <div className="w-1/3 h-[70vh] min-w-[300px] mx-auto mt-12 bg-black rounded-xl shadow-lg overflow-hidden">
      {/* Content */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-8 h-full">
        <h3 className="text-3xl font-semibold text-white mb-2">
          Barber
        </h3>
        {/* Heading */}
        <h1 
          className="text-6xl font-bold mb-2"   
          style={{
            backgroundImage: 'linear-gradient(to right,rgb(227, 222, 218) 0%,rgb(89, 67, 54) 42%, #1e130c 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Ohio State's #1 Barber
        </h1>
        {/* Subtitle */}
        <h2 className="text-4xl font-semibold text-white mb-6">
          TCUTTS
        </h2>
        {/* Social Media Buttons */}
        <div className="flex gap-10 mt-4">
          <button 
            className="group text-white transition-all duration-200"
            onClick={() => window.open('https://instagram.com/your-handle', '_blank')}
          >
            <FaInstagram 
              size={32} 
              className="transition-all duration-200 group-hover:scale-125" 
              style={{ color: 'white' }}
              onMouseOver={e => e.currentTarget.style.color = '#E1306C'}
              onMouseOut={e => e.currentTarget.style.color = 'white'}
            />
          </button>
          <button 
            className="group text-white transition-all duration-200"
            onClick={() => window.open('https://tiktok.com/@your-handle', '_blank')}
          >
            <FaTiktok 
              size={32} 
              className="transition-all duration-200 group-hover:scale-125" 
              style={{ color: 'white' }}
              onMouseOver={e => e.currentTarget.style.color = '#8f5aff'}
              onMouseOut={e => e.currentTarget.style.color = 'white'}
            />
          </button>
        </div>
        {/* CTA Button */}
        
      </div>
    </div>
  )
}

export default HomeCard
