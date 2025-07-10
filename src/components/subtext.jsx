import React from 'react'

function subtext({text}) {
  return (
    <div className="flex flex-col items-center justify-center py-5 px-5 sm:px-10 md:px-16 sm:py-10 md:py-20">
          <p className="birthstone-regular text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-black max-w-4xl mx-auto">
          "{text}"
          </p>
        </div>
  )
}

export default subtext 