import BookingNav from '../components/bookingpage/BookingNav'
import BookingCard from '../components/bookingpage/BookingCard'
import reactLogo from '../assets/react.svg'
import BookingCalender from '../components/bookingpage/BookingCalender'
import BookingFrom from '../components/bookingpage/BookingFrom'
import BookingTime from '../components/bookingpage/BookingTime'
function BookingPage() {
  return (
    <>
    <body className="bg-black">
    <BookingNav />
      
      <BookingCard text="Low Taper" price="$10"  text2="Emergency Cut" price2="$50" />
      <p className="text-white raleway-bold text-center text-2xl mt-5 font-bold">Select A Date & Time</p>
      <BookingCalender />
      <BookingTime numbers={[10,11,12,13,14,15,16,17,18,19,20]} />
     
    </body>
   
   
    </>
  )
}

export default BookingPage
