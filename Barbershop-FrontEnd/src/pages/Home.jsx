
import React from "react";
import Navbar from "../components/homepage/Navbar";
import HomeCard from "../components/homepage/HomeCard";
import Headings from "../components/homepage/Headings";
import HaircutExample from "../components/homepage/HaircutExample";
import Subtext from "../components/homepage/subtext";
import ContactCard from "../components/homepage/ContactCard";
import BookYourAppointment from "../components/homepage/BookYourAppointment";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Soft brand backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#DDCA7D]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(221,202,125,0.12),transparent_60%)]" />
      </div>

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="h-full w-full bg-[linear-gradient(transparent,transparent_31px,#fff_32px),linear-gradient(90deg,transparent,transparent_31px,#fff_32px)] bg-[length:32px_32px]" />
      </div>

      <div className="relative z-10">
        <Navbar text="TCUTSS" />

        {/* Hero */}
        <section className="px-6">
          <HomeCard />
        </section>

        {/* CTA */}
        <section className="px-4 mt-10">
          <BookYourAppointment />
        </section>


       

        {/* Quote */}
        <section className="px-4 mt-6">
          <div className="mx-auto max-w-3xl">
            <Subtext text="“Commit your works to the Lord, and your plans will be established”" />
          </div>
        </section>

        {/* Contact */}
        <section className="px-4 mt-8 pb-16">
          <div className="mx-auto max-w-6xl">
            <ContactCard />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} TCUTSS • All rights reserved
        </footer>
      </div>
    </div>
  );
}
