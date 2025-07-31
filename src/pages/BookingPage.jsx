import BookingNav from '../components/bookingpage/BookingNav'
import BookingCard from '../components/bookingpage/BookingCard'
import reactLogo from '../assets/react.svg'
import BookingCalender from '../components/bookingpage/BookingCalender'
import BookingFrom from '../components/bookingpage/BookingFrom'
import BookingTime from '../components/bookingpage/BookingTime'
import BookingForm from '../components/bookingpage/BookingForm'
import { useState } from 'react'

function BookingPage() {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [service, setService] = useState('');
  return (
    <div className="bg-black">
      <BookingNav />
      <BookingCard text="Low Taper" price="$10" text2="Emergency Cut" price2="$50" setService={setService} />
      <p className="text-white raleway-bold text-center text-2xl mt-5 font-bold">Select A Date & Time</p>
      <BookingCalender setDate={setDate} />
      <BookingTime numbers={[10,11,12,13,14,15,16,17,18,19,20]} setTime={setTime} />
      <BookingForm service={service} date={date} time={time}/>
    </div>
  );
}


export default BookingPage
