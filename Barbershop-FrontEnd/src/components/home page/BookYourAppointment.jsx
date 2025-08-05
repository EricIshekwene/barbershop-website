import { Link } from 'react-router-dom';

function BookYourAppointment() {
  return (
    <div className="flex justify-center items-center">
      <Link
        to="/booking"
        className="bg-[#1c1808] raleway-bold text-[#DDCA7D] px-12 py-4 rounded-lg text-lg font-medium uppercase tracking-wide shadow-lg transition-all duration-500 transform hover:scale-105"
        
      >
        Book Your Appointment
      </Link>
    </div>
  );
}

export default BookYourAppointment;
