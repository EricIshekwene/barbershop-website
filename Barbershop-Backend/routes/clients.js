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
router.get('/verified-clients', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT name, phone, email, instagram, verified 
         FROM clients 
         WHERE email_verified = true`
    );

    // Normalize data for frontend
    const clients = result.rows.map(client => ({
      name: client.name,
      phone: client.phone,
      email: client.email,
      instagram: client.instagram ?? null,
      verified: client.verified
    }));

    res.status(200).json({ count: clients.length, clients: clients });
  } catch (err) {
    console.error("❌ Error fetching verified clients:", err.message);
    res.status(500).json({ error: "Server error fetching verified clients" });
  }
});

router.patch('/update-client', async (req, res) => {
  try {
    let { name, phone, email, instagram, status } = req.body;
    instagram = (instagram || '').replace(/^@/, ''); 
    const result = await pool.query(
      `UPDATE clients SET name = $1, phone = $2, instagram = $3, verified = $4 WHERE email = $5`,
      [name, phone, instagram, status, email]
    );
    res.status(200).json({ message: "Client updated successfully" });
  }
  catch (err) {
    console.error("❌ Error updating client:", err.message);
    res.status(500).json({ error: "Server error updating client" });
  }
});
router.post('/mail-client', async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    
    if (!email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const info = await transporter.sendMail({
      from: `"TCUTT BARBERSHOP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
      html: `<p>${message}</p>`, 
    });
    return res.status(200).json({ message: 'Email sent successfully', id: info.messageId });
  }
  catch (err) {
    console.error("❌ Error mailing client:", err.message);
    return res.status(500).json({ error: "Server error mailing client" });
  }
});
router.post('/mail-all-clients', async (req, res) => {
  try {
    const { subject, message } = req.body || {};

    if (!subject || !message) {
      return res.status(400).json({ error: 'subject and message are required' });
    }

    // Get all verified emails
    const result = await pool.query(
      `SELECT email FROM clients WHERE email_verified = true`
    );

    // Extract, dedupe, and validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allEmails = (result.rows || [])
      .map(r => r.email)
      .filter(Boolean);

    const uniqueEmails = [...new Set(allEmails)].filter(e => emailRegex.test(e));

    if (uniqueEmails.length === 0) {
      return res.status(400).json({ error: 'No valid verified client emails found' });
    }

    // Helper: chunk into safe BCC groups (Gmail soft limit ~100)
    const chunkSize = 80;
    const chunks = [];
    for (let i = 0; i < uniqueEmails.length; i += chunkSize) {
      chunks.push(uniqueEmails.slice(i, i + chunkSize));
    }

    const html = `<p>${message}</p>`; // simple HTML
    const from = `"TCUTT BARBERSHOP" <${process.env.EMAIL_USER}>`;

    const results = [];
    for (const group of chunks) {
      try {
        const info = await transporter.sendMail({
          from,
          to: process.env.EMAIL_USER, // required "to"; real recipients in BCC
          bcc: group,
          subject,
          text: message,
          html,
        });
        results.push({ groupSize: group.length, messageId: info.messageId });
      } catch (err) {
        // capture the failing group so you can retry if needed
        results.push({ groupSize: group.length, error: err.message });
      }
    }

    const sent = results.filter(r => r.messageId).reduce((sum, r) => sum + r.groupSize, 0);
    const failedGroups = results.filter(r => r.error);

    return res.status(200).json({
      attempted: uniqueEmails.length,
      sent,
      groups: results,
      failures: failedGroups.length,
    });
  } catch (err) {
    console.error("❌ Error mailing all clients:", err.message);
    return res.status(500).json({ error: "Server error mailing all clients" });
  }
});

module.exports = router;