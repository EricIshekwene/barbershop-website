import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import cuttVideo from "../../assets/cutts.mov";

export default function HomeCard() {
  return (
    <div className="mx-auto mt-10 w-full max-w-[400px] rounded-3xl overflow-hidden border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
      {/* 4:5 aspect keeps the hero taller without stretching the video */}
      <div className="relative aspect-[4/5]" style={{ aspectRatio: "4 / 5" }}>
        <video
          src={cuttVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        {/* Centered overlay content */}
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-6">
          <h2 className="hurricane-regular text-4xl md:text-5xl text-white/90">TCUTSS</h2>
          <h1 className="raleway-bold text-[#DDCA7D] text-4xl md:text-5xl mt-2 tracking-tight">
            OSU&apos;s #1 Barber
          </h1>

          <div className="mt-6 flex gap-8">
            <button
              className="group"
              onClick={() => window.open("https://instagram.com/tcutss", "_blank")}
              aria-label="Instagram"
            >
              <FaInstagram className="text-white text-4xl md:text-5xl group-hover:scale-110 transition-transform" />
            </button>
            <button
              className="group"
              onClick={() => window.open("https://www.tiktok.com/@tcutss_?_t=ZP-8z9D32jVKnP&_r=1", "_blank")}
              aria-label="Tiktok"
            >
              <FaTiktok className="text-white text-4xl md:text-5xl group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
