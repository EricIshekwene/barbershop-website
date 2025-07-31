import Navbar from '../components/home page/Navbar'
import HomeCard from '../components/home page/HomeCard'
import BookYourAppointment from '../components/home page/BookYourAppointment'
import reactLogo from '../assets/react.svg'
import Subtext from '../components/home page/subtext'
import HaircutExample from '../components/home page/HaircutExample'
import Headings from '../components/home page/Headings'
import ContactCard from '../components/home page/ContactCard'
import { useState } from 'react'

function Home() {
  const [firstName, setFirstName] = useState('');
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
       
        <p>{firstName}</p>
      </div>
    </>
  )
}

export default Home
