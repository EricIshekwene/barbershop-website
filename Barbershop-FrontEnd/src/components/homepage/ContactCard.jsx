import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

function ContactCard() {
  return (
    <div id="contact" className="w-full">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="raleway-bold text-2xl text-[#DDCA7D]">Contact Us</p>
            <p className="text-white/70 text-sm">
              Reach out for questions, collabs, or special requests.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://instagram.com/your-handle"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              <FaInstagram className="text-[#DDCA7D]" />
              Instagram
            </a>
            <a
              href="https://tiktok.com/@your-handle"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              <FaTiktok className="text-[#DDCA7D]" />
              TikTok
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContactCard;
