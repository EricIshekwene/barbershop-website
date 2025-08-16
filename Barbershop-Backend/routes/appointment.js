const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, c.email_verified
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      WHERE c.email_verified = true
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    const appointments = result.rows.map(appointment => ({
      name: appointment.name,
      time: appointment.appointment_time,
      date: appointment.appointment_date,
      service: appointment.service_type,
      instagram: appointment.instagram ? `@${appointment.instagram}` : null,
      status: appointment.verified,         
      bookingStatus: appointment.status,      
      phone: appointment.phone,
      email: appointment.email
    }));

    let pastAppointments = [];
    let upcomingAppointments = [];

    appointments.forEach(appt => {
      if (new Date(appt.date) < new Date()) {
        pastAppointments.push(appt);
      } else {
        upcomingAppointments.push(appt);
      }
    });

    res.status(200).json({ pastAppointments, upcomingAppointments });
  } catch (err) {
    console.error("❌ Error fetching appointments:", err.message);
    res.status(500).json({ error: err.message, message: "Error fetching appointments" });
  }
});

module.exports = router;
