import React from "react";

function Navbar({ text }) {
  return (
    <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {text && <p className="text-[#DDCA7D] hurricane-regular text-3xl tracking-wide">{text}</p>}
        </div>
        <div className="flex items-center">
          <div className="flex gap-2">

            <a
              href="/booking"
              className="hidden sm:inline-flex px-5 py-2 rounded-lg text-sm font-bold montserrat-navbar-btn bg-[#DDCA7D] text-black hover:brightness-95 shadow-sm"
            >
              Booking
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
