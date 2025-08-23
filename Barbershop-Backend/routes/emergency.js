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

  router.get("/get-requests", async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          er.id AS request_id,
          er.service_type,
          er.reason,
          er.status,
          er.created_at,
          c.id AS client_id,
          c.name,
          c.email,
          c.instagram,
          c.phone,
          COALESCE(
            json_agg(
              json_build_object(
                'slot_date', ers.slot_date,
                'slot_time', ers.slot_time
              )
              ORDER BY ers.slot_date, ers.slot_time
            ) FILTER (WHERE ers.id IS NOT NULL), '[]'
          ) AS proposals
        FROM emergency_requests er
        JOIN clients c ON er.client_id = c.id
        LEFT JOIN emergency_request_slots ers ON er.id = ers.request_id
        GROUP BY er.id, c.id
        ORDER BY er.created_at DESC
        `
      );
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("❌ Error fetching emergency requests:", err);
      res.status(500).json({ error: "Failed to fetch emergency requests" });
    }
  });

router.delete("/delete-request", async (req, res) => {
  const { requestId } = req.body;
  if (!Number.isInteger(requestId)) {
    return res.status(400).json({ error: "requestId must be an integer" });
  }
  try {
    // relies on emergency_request_slots(request_id) ON DELETE CASCADE
    const del = await pool.query(
      "DELETE FROM emergency_requests WHERE id = $1 RETURNING id",
      [requestId]
    );
    if (del.rowCount === 0) return res.status(404).json({ error: "Request not found" });
    res.status(200).json({ message: "Emergency request deleted", requestId });
  } catch (err) {
    console.error("❌ Error deleting emergency request:", err);
    res.status(500).json({ error: "Failed to delete emergency request" });
  }
});
router.patch("/cancel-request", async (req, res) => {
  const { requestId, email, name, reason } = req.body;

  try {
    // 1. Update status in DB
    const result = await pool.query(
      "UPDATE emergency_requests SET status = 'cancelled' WHERE id = $1 RETURNING id",
      [requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    // 2. Send cancellation email
    const subject = `❌ Your Emergency Cut Request was not approved`;

    const htmlBody = `
      <p>Hi ${name || "Client"},</p>
      <p>Unfortunately, your <strong>Emergency Cut</strong> request could not be approved at this time.</p>
      ${reason ? `<p><strong>Your Reason Provided:</strong> ${reason}</p>` : ""}
      <p>Please feel free to book a regular appointment through our booking system.</p>
      <p>We appreciate your understanding,</p>
      <p>- Barbershop Team</p>
    `;

    await transporter.sendMail({
      from: `"Barbershop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: htmlBody,
    });

    res.status(200).json({ message: "Emergency request cancelled and email sent" });
  } catch (err) {
    console.error("❌ Error cancelling emergency request:", err);
    res.status(500).json({ error: "Failed to cancel emergency request" });
  }
});

// PATCH /api/emergency/approve-request
// expects { requestId, slot_date, slot_time } from the UI's selectedProposal
router.patch("/approve-request", async (req, res) => {
  const { requestId, slot_date, slot_time } = req.body;
  if (!Number.isInteger(requestId) || !slot_date || !slot_time) {
    return res.status(400).json({ error: "requestId, slot_date and slot_time are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock the request row
    const reqRow = await client.query(
      "SELECT id, status, client_id, service_type FROM emergency_requests WHERE id = $1 FOR UPDATE",
      [requestId]
    );
    if (reqRow.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Request not found" });
    }
    if (reqRow.rows[0].status !== "pending") {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Only 'pending' requests can be approved" });
    }

    // Verify the chosen slot belongs to this request
    const slot = await client.query(
      "SELECT id FROM emergency_request_slots WHERE request_id = $1 AND slot_date = $2 AND slot_time = $3",
      [requestId, slot_date, slot_time]
    );
    if (slot.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Selected slot does not belong to this request" });
    }

    // Prevent double-booking
    const conflict = await client.query(
      "SELECT 1 FROM appointments WHERE date = $1 AND time = $2 LIMIT 1",
      [slot_date, slot_time]
    );
    if (conflict.rowCount) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "That time is already booked" });
    }

    
    const booking = await client.query(
      `INSERT INTO appointments (client_id, service, date, time, source, emergency_request_id)
       VALUES ($1,$2,$3,$4,'emergency',$5)
       RETURNING *`,
       [reqRow.rows[0].client_id, reqRow.rows[0].service_type, slot_date, slot_time, requestId]
     );

    // Mark request approved
    const upd = await client.query(
      "UPDATE emergency_requests SET status = 'approved' WHERE id = $1 RETURNING *",
      [requestId]
    );

    await client.query("COMMIT");
    res.status(200).json({
      message: "Emergency request approved",
      request: upd.rows[0],
      booking: booking.rows[0],
      approved_slot: { slot_date, slot_time }
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error approving emergency request:", err);
    res.status(500).json({ error: "Failed to approve emergency request" });
  } finally {
    client.release();
  }
});

module.exports = router;
