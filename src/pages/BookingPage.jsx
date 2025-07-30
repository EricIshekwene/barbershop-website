import BookingNav from '../components/BookingNav'
import BookingCard from '../components/BookingCard'
import reactLogo from '../assets/react.svg'
import BookingCalender from '../components/BookingCalender'
import BookingFrom from '../components/BookingFrom'
function BookingPage() {
  return (
    <>
    <body className="bg-black">
      <BookingNav />
      <BookingCard text="Low Taper" price="$10"  text2="Emergency Cut" price2="$50" />
      <p className="text-white raleway-bold text-center text-2xl mt-5 font-bold">Select A Date & Time</p>
      <BookingCalender />
      <BookingFrom />
    </body>
   
   
    </>
  )
}

export default BookingPage
