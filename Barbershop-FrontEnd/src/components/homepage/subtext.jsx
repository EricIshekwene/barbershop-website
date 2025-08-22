import React from "react";

function subtext({ text }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 text-center">
      <p className="birthstone-regular mx-auto max-w-3xl text-white/90 text-xl sm:text-2xl md:text-3xl">
        {text}
      </p>
    </div>
  );
}
export default subtext;
