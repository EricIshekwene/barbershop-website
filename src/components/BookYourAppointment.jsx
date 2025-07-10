import { Link } from 'react-router-dom';

function BookYourAppointment() {
  return (
    <div className="flex justify-center items-center">
      <Link
        to="/booking"
        className="text-white px-12 py-4 rounded-lg text-lg font-medium uppercase tracking-wide shadow-lg transition-all duration-500 transform hover:scale-105"
        style={{
          backgroundImage: 'linear-gradient(to right, #1e130c 0%, #9a8478 51%, #1e130c 100%)',
          backgroundSize: '200% auto',
          boxShadow: '0 0 20px #eee'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundPosition = 'right center';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundPosition = 'left center';
        }}
      >
        Book Your Appointment
      </Link>
    </div>
  );
}

export default BookYourAppointment;
