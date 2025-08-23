import React from "react";
import { TiTick } from "react-icons/ti";
import { FaCalendarAlt, FaClock, FaRegEnvelope, FaHome } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function EmergencySubmitted() {
    const { name, email, service, proposals, message } = useLocation().state;
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Soft gradient backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#DDCA7D]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(221,202,125,0.12),transparent_60%)]" />
      </div>

      {/* Subtle grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="h-full w-full bg-[linear-gradient(transparent,transparent_31px,#fff_32px),linear-gradient(90deg,transparent,transparent_31px,#fff_32px)] bg-[length:32px_32px]" />
      </div>

      {/* Content */}
      <main className="relative mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-3xl border border-white/15 bg-white/10 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#DDCA7D]/30 bg-[#DDCA7D]/15">
              <TiTick className="text-3xl text-[#DDCA7D]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white raleway-bold">
                Emergency request received
              </h1>
              <p className="text-sm text-white/70 raleway-regular">
                Thanks—you’re on our priority list. We’ll confirm an approved time by email.
              </p>
            </div>
          </div>

          {/* Highlight card */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <FaRegEnvelope className="text-[#DDCA7D]" />
              <p className="text-sm text-white/80">
                A confirmation will be sent to your email shortly.
              </p>
            </div>

            {/* Chips (replace with your dynamic data later) */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-[#DDCA7D]">
                <FaCalendarAlt className="opacity-90" />
                {proposals[0] && proposals[0].date + ' — ' + proposals[0].time}
              </span>
              {proposals[1] && <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-[#DDCA7D]">
                <FaCalendarAlt className="opacity-90" />
                {proposals[1] && proposals[1].date + ' — ' + proposals[1].time}
              </span>}
              {proposals[2] && <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-[#DDCA7D]">
                <FaCalendarAlt className="opacity-90" />
                {proposals[2] && proposals[2].date + ' — ' + proposals[2].time}
              </span>}
            </div>
          </div>

          {/* Info grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Service</p>
              <p className="mt-1 text-sm font-semibold">Emergency Cut</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Typical response</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                <FaClock className="text-[#DDCA7D]" />
                ASAP (same-day if possible)
              </p>
            </div>
          </div>

          {/* CTA row */}
          <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <FaHome className="text-[#DDCA7D]" />
              Back to Home
            </a>
          </div>

          {/* Fine print */}
          <p className="mt-6 text-center text-xs text-white/50">
            If you need to update your proposed times, reply to the confirmation email and we’ll adjust your request.
          </p>
        </div>
      </main>
    </div>
  );
}
