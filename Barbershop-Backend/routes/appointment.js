const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        c.email_verified,
        (
          (a.appointment_date::text || ' ' || a.appointment_time::text)::timestamp
        ) AT TIME ZONE 'America/New_York' AS full_datetime
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      WHERE c.email_verified = true
        AND COALESCE(LOWER(a.status), '') NOT IN ('cancelled','canceled')  -- ← hide cancelled
    `);

    if (result.rows.length === 0) {
      return res.status(200).json({ pastAppointments: [], upcomingAppointments: [] });
    }

    // Compare using EST "now"
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

    const appointments = result.rows.map(a => ({
      name: a.name,
      time: a.appointment_time,
      date: a.appointment_date,
      service: a.service_type,
      instagram: a.instagram ? `@${a.instagram}` : null,
      status: a.verified,           // client verification flag
      bookingStatus: a.status,      // appointment status (won't be 'cancelled' here)
      phone: a.phone,
      email: a.email,
      full_datetime: a.full_datetime
    }));

    const pastAppointments = [];
    const upcomingAppointments = [];

    for (const appt of appointments) {
      const apptDate = new Date(appt.full_datetime);
      (apptDate < now ? pastAppointments : upcomingAppointments).push(appt);
    }

    res.status(200).json({ pastAppointments, upcomingAppointments });
  } catch (err) {
    console.error("❌ Error fetching appointments:", err.message);
    res.status(500).json({ error: err.message, message: "Error fetching appointments" });
  }
});


module.exports = router;
