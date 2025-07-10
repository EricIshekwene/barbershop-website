import Navbar from '../components/Navbar'
import HomeCard from '../components/HomeCard'
import BookYourAppointment from '../components/BookYourAppointment'
import reactLogo from '../assets/react.svg'
import Subtext from '../components/subtext'
import HaircutExample from '../components/HaircutExample'

function Home() {
  return (
    <>
      <Navbar logo={reactLogo} />
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center gap-10">
          <HomeCard />
          <BookYourAppointment />
        </div>
        <Subtext text="Sharp cuts, done right. Easy booking, no hassle."/>
        <HaircutExample />
      </div>
    </>
  )
}

export default Home
