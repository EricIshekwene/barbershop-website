import React from "react";

function Headings({ text, subtext }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      <p className="text-center raleway-bold text-3xl md:text-5xl text-[#DDCA7D]">
        {text}
      </p>
      {subtext && (
        <p className="mt-2 text-center raleway-regular text-white/80 text-lg md:text-2xl">
          {subtext}
        </p>
      )}
    </div>
  );
}
export default Headings;
