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

router.post('/request', async (req, res) => {
  const { email, service, proposals, reason } = req.body;

  if (!email || !service || !Array.isArray(proposals) || proposals.length === 0) {
    return res.status(400).json({ error: 'Email, service, and at least one proposal are required.' });
  }

  try {
    // 1. Find client_id from email
    const clientRes = await pool.query(
      'SELECT id FROM clients WHERE email_verified = true AND email = $1',
      [email.trim().toLowerCase()]
    );
    if (clientRes.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found.' });
    }
    const clientId = clientRes.rows[0].id;

    // 2. Insert into emergency_requests
    const requestRes = await pool.query(
      `INSERT INTO emergency_requests (client_id, service_type, reason)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [clientId, service, reason || null]
    );
    const requestId = requestRes.rows[0].id;

    // 3. Insert proposals into emergency_request_slots (max 3)
    for (let i = 0; i < proposals.length && i < 3; i++) {
      const { date, time } = proposals[i];
      await pool.query(
        `INSERT INTO emergency_request_slots (request_id, slot_date, slot_time)
         VALUES ($1, $2, $3)`,
        [requestId, date, time]
      );
    }

    res.status(201).json({
      message: 'Emergency request submitted successfully',
      requestId
    });
  } catch (err) {
    console.error('❌ Error submitting emergency request:', err);
    res.status(500).json({ error: 'Failed to submit emergency request' });
  }
});
router.post('/mail-request', async (req, res) => {
    try {
      const { name, email, reason, proposals } = req.body;
  
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }
  
      const slotList = (proposals || [])
        .map(p => `<li>${p.date} @ ${p.time}</li>`)
        .join('');
  
      const subject = `🚨 Your Emergency Cut Request has been received`;
  
      const htmlBody = `
        <p>Hi ${name},</p>
        <p>We’ve received your <strong>Emergency Cut</strong> request. Our team will review and confirm one of your proposed times shortly.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <p><strong>Proposed Times:</strong></p>
        <ul>${slotList || "<li>No times provided</li>"}</ul>
        <p>We’ll follow up with a confirmation email soon.</p>
        <p>- Barbershop Team</p>
      `;
  
      await transporter.sendMail({
        from: `"Barbershop" <${process.env.EMAIL_USER}>`,
        to: email, // 📩 notify client
        subject,
        html: htmlBody,
      });
  
      return res.status(200).json({ message: "Emergency request email sent to client" });
    } catch (err) {
      console.error("❌ Error sending emergency request email:", err);
      return res.status(500).json({ error: "Failed to send emergency request email" });
    }
  });
module.exports = router;
