import { Link } from "react-router-dom";

function BookYourAppointment() {
  return (
    <div className="flex justify-center items-center">
      <Link
        to="/booking"
        className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wide
                   bg-[#DDCA7D] text-[#1c1808] shadow-[0_10px_30px_rgba(221,202,125,0.25)]
                   hover:scale-[1.02] transition-transform border border-[#DDCA7D]/20"
      >
        Book Your Appointment
      </Link>
    </div>
  );
}
export default BookYourAppointment;
