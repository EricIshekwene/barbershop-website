const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
//const { sendConfirmationEmail } = require('../mailer');

router.post('/send-confirmation', async (req, res) => {
    const { name, email } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000); 
    res.status(200).json({ message: "Email sent", code });
    console.log("Email sent", code);
    /*try {
        await sendConfirmationEmail(email, name, code);
        res.status(200).json({ message: "Email sent", code });
    } catch (err) {
        console.error('Email error:', err.message);
        res.status(500).json({ error: "Failed to send email" });
    }*/
});

router.post('/verify-email', async (req, res) => {
    const { email, code } = req.body;
  
    if (!email || !code) {
      return res.status(400).json({ error: "Email and verification code are required" });
    }
  
    try {
      // Check for matching unverified client + code
      const result = await pool.query(
        `SELECT * FROM clients 
         WHERE email = $1 
           AND email_verified = false 
         LIMIT 1`,
        [email]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Invalid email or code" });
      }
  
      // Update to verified
      await pool.query(
        `UPDATE clients
         SET email_verified = true
         WHERE email = $1`,
        [email]
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
  
    try {
      // 1️⃣ Find verified client
      const clientResult = await pool.query(
        `SELECT id FROM clients WHERE email = $1 AND email_verified = true LIMIT 1`,
        [email]
      );
  
      if (clientResult.rows.length === 0) {
        return res.status(404).json({ error: "Verified client not found. Please verify email first." });
      }
  
      const clientId = clientResult.rows[0].id;
  
      // 2️⃣ Insert booking
      const bookingResult = await pool.query(
        `INSERT INTO appointments (client_id, service_type, appointment_date, appointment_time, status)
         VALUES ($1, $2, $3, $4, 'pending')
         RETURNING *`,
        [clientId, service, date, time]
      );
      console.log("Booking added successfully", bookingResult.rows[0]);
      return res.status(201).json({
        message: "Booking added successfully",
        booking: bookingResult.rows[0]
      });
  
    } catch (err) {
      console.error("❌ Error adding booking:", err.message);
      return res.status(500).json({ error: "Server error while adding booking" });
    }
  });
  

module.exports = router;