import BookingNav from '../components/bookingpage/BookingNav'
import BookingCard from '../components/bookingpage/BookingCard'
import reactLogo from '../assets/react.svg'
import BookingCalender from '../components/bookingpage/BookingCalender'
import BookingTime from '../components/bookingpage/BookingTime'
import BookingForm from '../components/bookingpage/BookingForm.jsx';
import { useEffect, useState } from 'react'
import EmergencyTimePicker from '../components/bookingpage/EmergencyPicker';
function BookingPage() {
 
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [service, setService] = useState('');
  const [emergency, setEmergency] = useState({ proposals: [] });

  return (
    <div className="min-h-screen bg-black">
      <BookingNav />
      <BookingCard text="Low Taper" price="$30" text2="Emergency Cut" price2="$50" setService={setService} />
      <p className="text-white raleway-bold text-center text-2xl mt-5 font-bold">Select A Date & Time</p>
      {service === 'Emergency Cut' ? (
        <div className="flex justify-center mt-4">
          <EmergencyTimePicker onChange={setEmergency} />
        </div>
      ) : (
        <BookingCalender setDate={setDate} setTime={setTime} />
      )}
      <BookingForm service={service} date={date} time={time} emergency={emergency}/>
    </div>
  );
}


export default BookingPage
