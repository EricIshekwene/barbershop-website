import React, { useState, useEffect, useMemo } from 'react';
import { FaInstagram, FaChevronDown } from "react-icons/fa";
import UpcomingAppointment from './AdminSubcomponents/UpcomingAppointment';
import PastAppointments from './AdminSubcomponents/PastAppointments';
import '../../../scrollbar.css';

export default function AdminAppointments() {
  const [showUpcomingAppointments, setShowUpcomingAppointments] = useState(true);
  const [showPastAppointments, setShowPastAppointments] = useState(false);

  const AvailableTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none";

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [error, setError] = useState(null);

  // Search queries
  const [upcomingQuery, setUpcomingQuery] = useState("");
  const [pastQuery, setPastQuery] = useState("");

  // Fake data (fallback for upcoming list)
  const fakeData = [
    { name: "John Doe", time: "10:00 AM", date: "10/10/2025", service: "Low Taper $20", instagram: "john_doe", status: "Verified", bookingStatus: "Pending" },
    { name: "Jane Smith", time: "11:00 AM", date: "10/10/2025", service: "Mid Fade $25", instagram: "janesmith", status: "Unverified", bookingStatus: "Approved" },
    { name: "Alex Lee", time: "12:00 PM", date: "10/10/2025", service: "High Fade $30", instagram: "alexlee", status: "Unverified", bookingStatus: "Pending" },
    { name: "John Doe", time: "10:00 AM", date: "10/10/2025", service: "Low Taper $20", instagram: "john_doe", status: "Verified", bookingStatus: "Pending" },
    { name: "Jane Smith", time: "11:00 AM", date: "10/10/2025", service: "Mid Fade $25", instagram: "janesmith", status: "Unverified", bookingStatus: "Approved" },
    { name: "Alex Lee", time: "12:00 PM", date: "10/10/2025", service: "High Fade $30", instagram: "alexlee", status: "Unverified", bookingStatus: "Pending" },
  ];

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/appointments", {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setPastAppointments(data.pastAppointments || []);
        setUpcomingAppointments(data.upcomingAppointments || []);
      } catch (err) {
        console.error("❌ Error fetching appointments:", err);
        setError(err.message || "Failed to load appointments");
      }
    };

    fetchAppointments();
  }, []);

  // Helpers for search filtering
  const norm = (v) => (v ?? "").toString().toLowerCase();
  const matches = (item, q) => {
    return item.name?.toLowerCase().includes(q.toLowerCase());
  };

  // Sources (with fallback for upcoming list)
  const upcomingSource = upcomingAppointments.length ? upcomingAppointments : fakeData;
  const pastSource = pastAppointments;

  //const upcomingSource = fakeData;
//const pastSource = fakeData;

  // Filtered lists
  const filteredUpcoming = useMemo(
    () => upcomingSource.filter((it) => matches(it, upcomingQuery)),
    [upcomingSource, upcomingQuery]
  );

  const filteredPast = useMemo(
    () => pastSource.filter((it) => matches(it, pastQuery)),
    [pastSource, pastQuery]
  );

  // Counts
  const upcomingTotal = upcomingSource.length;
  const pastTotal = pastSource.length;

  // Toggle handlers
  const handleToggleUpcoming = () => setShowUpcomingAppointments((v) => !v);
  const handleTogglePast = () => setShowPastAppointments((v) => !v);

  return (
    <div className="flex flex-col bg-black m-8 mt-4 p-4 rounded-lg gap-4 border border-white/20">
      {/* ============== Upcoming Appointments ============== */}
      <div className="flex flex-row items-center gap-2 cursor-pointer">
        <p className="text-2xl raleway-bold text-white">Upcoming Appointments</p>

        {/* Count badge (shows filtered / total if searching) */}
        <div className={AvailableTimeslotsStyle}>
          <p>
            {filteredUpcoming.length}{upcomingQuery ? ` / ${upcomingTotal}` : ""}
          </p>
        </div>

        <FaChevronDown
          className={`text-white text-2xl transition-transform duration-200 ${showUpcomingAppointments ? "rotate-90" : ""}`}
          onClick={handleToggleUpcoming}
        />

        {showUpcomingAppointments && (
          <div className="relative w-1/4">
            <input
              type="text"
              value={upcomingQuery}
              onChange={(e) => setUpcomingQuery(e.target.value)}
              placeholder="Search name, service, @, status..."
              className="bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-full focus:outline-none"
            />
            {!!upcomingQuery && (
              <button
                type="button"
                onClick={() => setUpcomingQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>

      {showUpcomingAppointments && (
        <div
          className="max-h-[450px] overflow-y-auto pr-2 space-y-4 custom-scrollbar"
          // If you want a hard cap of exactly 3 cards: style={{ maxHeight: 'calc(3 * 150px)' }}
        >
          {filteredUpcoming.length ? (
            filteredUpcoming.map((item, index) => (
              <UpcomingAppointment
                key={index}
                name={item.name}
                time={item.time}
                date={item.date}
                service={item.service}
                instagram={item.instagram}
                bookingStatus={item.bookingStatus}
                status={item.status}
              />
            ))
          ) : (
            <p className="text-white/60 italic px-1">No matches.</p>
          )}
        </div>
      )}

      {/* ============== Past Appointments ============== */}
      <div className="flex flex-row items-center gap-2 cursor-pointer">
        <p className="text-2xl raleway-bold text-white">Past Appointments</p>

        <div className={AvailableTimeslotsStyle}>
          <p>
            {filteredPast.length}{pastQuery ? ` / ${pastTotal}` : ""}
          </p>
        </div>

        <FaChevronDown
          className={`text-white text-2xl transition-transform duration-200 ${showPastAppointments ? "rotate-90" : ""}`}
          onClick={handleTogglePast}
        />

        {showPastAppointments && (
          <div className="relative w-1/4">
            <input
              type="text"
              value={pastQuery}
              onChange={(e) => setPastQuery(e.target.value)}
              placeholder="Search name, service, @, status..."
              className="bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-full focus:outline-none"
            />
            {!!pastQuery && (
              <button
                type="button"
                onClick={() => setPastQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>

      {showPastAppointments && (
        <div className="max-h-[450px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {filteredPast.length ? (
            filteredPast.map((item, index) => (
              <PastAppointments
                key={index}
                name={item.name}
                time={item.time}
                date={item.date}
                service={item.service}
                instagram={item.instagram}
                bookingStatus={item.bookingStatus}
                status={item.status}
              />
            ))
          ) : (
            <p className="text-white/60 italic px-1">No matches.</p>
          )}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
