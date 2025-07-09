import React from 'react'

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
        {/* CTA Button */}
        
      </div>
    </div>
  )
}

export default HomeCard
