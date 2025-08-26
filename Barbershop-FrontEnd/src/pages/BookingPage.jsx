import BookingNav from '../components/bookingpage/BookingNav'
import BookingCard from '../components/bookingpage/BookingCard'
import BookingCalender from '../components/bookingpage/BookingCalender'
import BookingTime from '../components/bookingpage/BookingTime'
import BookingForm from '../components/bookingpage/BookingForm.jsx'
import EmergencyTimePicker from '../components/bookingpage/EmergencyPicker'
import { useState } from 'react'

function BookingPage() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [service, setService] = useState('');
  const [emergency, setEmergency] = useState({ proposals: [] });

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background layers (behind everything, non-interactive) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#DDCA7D]/10 via-black to-black" />
        {/* gold glow blobs */}
        <div className="absolute -top-20 -left-16 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] rounded-full bg-[#DDCA7D]/20 blur-[120px] opacity-30" />
        <div className="absolute bottom-0 right-[-10%] w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full bg-[#DDCA7D]/10 blur-[120px] opacity-25" />
      </div>

      {/* Page content */}
      <div className="relative z-10">
        <BookingNav />

        {/* Content wrapper */}
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mt-6">
            <BookingCard
              text="Regular Cut"
              price="$30"
              text2="Emergency Cut"
              price2="$50"
              setService={setService}
            />
          </div>

          <p className="text-white raleway-bold text-center text-2xl mt-6">
            Select A Date &amp; Time
          </p>

          <div className="mt-4 flex justify-center">
            {service === 'Emergency Cut' ? (
              <EmergencyTimePicker onChange={setEmergency} />
            ) : (
              <BookingCalender setDate={setDate} setTime={setTime} />
            )}
          </div>

          <div className="mt-6">
            <BookingForm
              service={service}
              date={date}
              time={time}
              emergency={emergency}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage
