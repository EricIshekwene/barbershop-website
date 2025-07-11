import BookingNav from '../components/BookingNav'
import BookingCard from '../components/BookingCard'
import reactLogo from '../assets/react.svg'

function BookingPage() {
  return (
    <>
    <body className="bg-black">
      <BookingNav />
      <BookingCard text="Low Taper" price="$10" image={reactLogo}/>
    </body>
   
   
    </>
  )
}

export default BookingPage
