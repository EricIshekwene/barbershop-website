import React from 'react'
export default function Payment() {
  return (
    <div>
      
{/* 💸 Payment Buttons (cool frosted/glow style) */}
<section className="px-4 mt-7">
  <div className="mx-auto max-w-2xl">
    <div className="relative overflow-hidden rounded-2xl  backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
      {/* subtle gold glow + diagonal sheen */}
      

      <h2 className="relative text-center text-lg sm:text-xl font-bold text-[#DDCA7D]">
        Pay for your appointment:
      </h2>

      <div className="relative mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        {/* Venmo */}
        <a
          href="https://venmo.com/u/Elpollii"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pay thirty dollars via Venmo"
          className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold
                     text-[#3D95CE] border border-[#3D95CE]/50 bg-[#3D95CE]/15
                     hover:bg-[#3D95CE]/25 transition-all duration-300
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_30px_-8px_rgba(61,149,206,0.55)]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DDCA7D]/50"
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[#3D95CE] text-white font-extrabold leading-none">
            V
          </span>
          <span className="relative">
            Pay  via Venmo
            {/* micro sheen */}
            <span className="pointer-events-none absolute -inset-x-1 -top-1 h-0.5 opacity-0 group-hover:opacity-60 transition-opacity bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </span>
        </a>

        {/* Cash App */}
        <a
          href="https://cash.app/$elpollii"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pay thirty dollars via Cash App"
          className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold
                     text-green-400 border border-green-400/50 bg-green-500/15
                     hover:bg-green-500/25 transition-all duration-300
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_30px_-8px_rgba(34,197,94,0.55)]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DDCA7D]/50"
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-green-500 text-white font-extrabold leading-none">
            $
          </span>
          <span className="relative">
            Pay via Cash App
            <span className="pointer-events-none absolute -inset-x-1 -top-1 h-0.5 opacity-0 group-hover:opacity-60 transition-opacity bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </span>
        </a>
      </div>
    </div>
  </div>
</section>



    </div>
  )
}