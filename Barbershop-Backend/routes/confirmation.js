const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
function getTodayESTISO() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const y = parts.find(p => p.type === 'year').value;
  const m = parts.find(p => p.type === 'month').value;
  const d = parts.find(p => p.type === 'day').value;
  return `${y}-${m}-${d}`; // e.g. 2025-08-19
}


router.post('/mail-confirmation', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email required" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("code", code);

    await transporter.sendMail({
      from: `"Barbershop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Confirmation Code",
      text: `Hi ${name},\n\nYour confirmation code is: ${code}\n\n- Barbershop`,
      html: `<p>Hi ${name},</p>
             <p>Your confirmation code is: <strong>${code}</strong></p>
             <p>- Barbershop</p>`,
    });

    return res.status(200).json({ code });
  } catch (err) {
    console.error("❌ Error sending confirmation code:", err.message);
    return res.status(500).json({ error: "Failed to send confirmation email" });
  }
});


router.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and verification code are required" });
  }
  const normEmail = String(email).trim().toLowerCase();

  try {
    // Check for matching unverified client + code
    const result = await pool.query(
      `SELECT * FROM clients 
         WHERE email = $1 
           AND email_verified = false 
         LIMIT 1`,
      [normEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid email or code" });
    }

    // Update to verified
    await pool.query(
      `UPDATE clients
         SET email_verified = true
         WHERE email = $1`,
      [normEmail]
    );

    return res.status(200).json({ message: "Email verified" });
  } catch (err) {
    console.error("❌ Error verifying email:", err.message);
    return res.status(500).json({ error: "Server error while verifying email" });
  }
});

router.post('/add-booking', async (req, res) => {
  const { name, email, date, time, service } = req.body;

  if (!name || !email || !date || !time || !service) {
    return res.status(400).json({ error: "Name, email, date, time, and service are required" });
  }

  // Optional: enforce YYYY-MM-DD to avoid surprises
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
    return res.status(400).json({ error: "Date must be YYYY-MM-DD" });
  }

  const normalizeTime = (t) => {
    const s = String(t).trim();
    if (/^\d{1,2}$/.test(s)) return s.padStart(2, '0') + ':00:00';  // "1" -> "01:00:00"
    if (/^\d{1,2}:\d{2}$/.test(s)) return s + ':00';                 // "01:00" -> "01:00:00"
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(s)) return s;                   // already HH:MM:SS
    throw new Error(`Bad time format: ${s}`);
  };

  // === EST "today" check (no conversions) ===
  const todayEST = getTodayESTISO(); // <- defined once at top of file
  if (date === todayEST) {
    return res.status(400).json({ error: "Same-day bookings are not allowed. Please book for tomorrow or later." });
  }

  let pgTime;
  try {
    pgTime = normalizeTime(time);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  try {
    // 1) Verified client
    const clientResult = await pool.query(
      `SELECT id, verified FROM clients WHERE email = $1 AND email_verified = true LIMIT 1`,
      [String(email).trim().toLowerCase()]
    );
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: "Verified client not found. Please verify email first." });
    }
    const clientId = clientResult.rows[0].id;
    const bookingStatus = clientResult.rows[0].verified ? 'approved' : 'pending';
    // After you compute clientId, date, pgTime, and before the INSERT:
    // Block if any existing active appt overlaps [newDate, newDate+3)
    const conflict = await pool.query(
      `
  SELECT 1
  FROM appointments
  WHERE client_id = $1
    AND COALESCE(LOWER(status), '') NOT IN ('cancelled','canceled')
    AND daterange(appointment_date, appointment_date + 3, '[)')
        && daterange($2::date, $2::date + 3, '[)')
  LIMIT 1
  `,
      [clientId, date]
    );

    if (conflict.rows.length) {
      return res.status(409).json({
        error: "You already have an appointment within 3 days. Please pick another date."
      });
    }


    // 2) Insert booking
    const bookingResult = await pool.query(
      `INSERT INTO appointments (client_id, service_type, appointment_date, appointment_time, status)
         VALUES ($1, $2, $3::date, $4::time, $5)
         RETURNING *`,
      [clientId, service, date, pgTime, bookingStatus]
    );
    await transporter.sendMail({
      from: `"TCUTSS BARBERSHOP" <${process.env.EMAIL_USER}>`,
      to: "tcutssinc@gmail.com",   // your own email
      subject: "New Booking Added",
      text: `A new booking has been added:\n\n
    Name: ${name}
    Email: ${email}
    Service: ${service}
    Date: ${date}
    Time: ${time}\n\n- TCUTSS System`,
      html: `
        <h2>New Booking Alert</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <hr/>
        <p>- TCUTSS System</p>
      `,
    });
    return res.status(201).json({
      message: "Booking added successfully",
      booking: bookingResult.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'That time slot is already booked.' });
    }
    console.error("❌ Error adding booking:", err.message);
    return res.status(500).json({ error: "Server error while adding booking" });
  }
});


module.exports = router;
