import Navbar from '../components/Navbar'
import HomeCard from '../components/HomeCard'
import BookYourAppointment from '../components/BookYourAppointment'
import reactLogo from '../assets/react.svg'
import Subtext from '../components/subtext'
import HaircutExample from '../components/HaircutExample'
import Headings from '../components/Headings'
import ContactCard from '../components/ContactCard'

function Home() {
  return (
    <>
      <Navbar logo={reactLogo} />
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center gap-10">
          
          <HomeCard />
          <BookYourAppointment />
        </div>
        <hr className="w-full border-t-2 border-gray-300 my-10"/>
        <Headings text="The product" subtext="See the quality and precision of the cuts"/>
        <HaircutExample />
      </div>
    </>
  )
}

export default Home
