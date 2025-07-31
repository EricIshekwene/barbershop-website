import React from 'react'

function Headings({ text, subtext }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 px-3 sm:px-5 md:px-16 sm:py-5 md:py-10">
      <p className="text-center text-2xl sm:text-3xl md:text-4xl xl:text-5xl raleway-bold">
        {text}
      </p>
      <p className="text-center text-xl sm:text-2xl md:text-3xl xl:text-4xl raleway-regular">
        {subtext}
      </p>
    </div>
  )
}

export default Headings
