import BookingNav from '../components/BookingNav'
import BookingCard from '../components/BookingCard'
import reactLogo from '../assets/react.svg'
import BookingCalender from '../components/BookingCalender'

function BookingPage() {
  return (
    <>
    <body className="bg-black">
      <BookingNav />
      <BookingCard text="Low Taper" price="$10"  text2="Emergency Cut" price2="$50" />
      <p className="text-white text-center text-2xl mt-5 font-bold">Select A Date & Time</p>
      <BookingCalender />
    </body>
   
   
    </>
  )
}

export default BookingPage
