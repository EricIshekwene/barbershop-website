import React from "react";
import image1 from "../../assets/images.jpeg";

function Card({ label }) {
  return (
    <div className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 bg-white/5 hover:bg-white/10 transition">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image1})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <span className="text-xl md:text-2xl raleway-bold text-[#DDCA7D] drop-shadow">
          {label}
        </span>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function HaircutExample() {
  const items = ["Low Taper", "Mid Fade", "Burst Fade", "Line Up"];

  // width knobs (smaller cards)
  const itemClass = "shrink-0 snap-center w-[55vw] sm:w-[300px] md:w-[330px]";

  return (
    <div className="relative">
      {/* Hide scrollbars cross-browser */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* The mask avoids seam lines on both edges */}
      <div
        className="no-scrollbar overflow-x-auto snap-x snap-mandatory scroll-smooth px-2 py-2"
        aria-label="Haircut examples carousel"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(100% - 16px), rgba(0,0,0,0))",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(100% - 16px), rgba(0,0,0,0))",
        }}
      >
        <div className="flex gap-4">
          {items.map((label, idx) => (
            <div key={idx} className={itemClass}>
              <Card label={label} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HaircutExample;
