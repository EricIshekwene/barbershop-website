import React from "react";
import { Link } from "react-router-dom"; // if you're using react-router
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center px-6">
      <h1 className="text-8xl font-bold text-[#DDCA7D]">404</h1>
      <p className="text-2xl mt-4 raleway-bold">Page Not Found</p>
      <p className="text-white/70 mt-2 max-w-md">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 flex items-center gap-2 px-6 py-2 rounded-xl bg-[#DDCA7D] text-black font-semibold hover:bg-[#c9b76c] transition-all duration-200"
      >
        <FaHome /> Back to Home
      </Link>
    </div>
  );
}
