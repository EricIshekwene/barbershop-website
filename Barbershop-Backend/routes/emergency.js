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
        from: `"TCUTSS BARBERSHOP" <${process.env.EMAIL_USER}>`,
        to: email, // 📩 notify client
        subject,
        html: htmlBody,
      });
      
      await transporter.sendMail({
        from: `"TCUTSS BARBERSHOP" <${process.env.EMAIL_USER}>`,
        to: "tcutssinc@gmail.com", 
        subject: `🚨 New Emergency Cut Request from ${name}`,
        html: `
          <h2>New Emergency Cut Request Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
          <p><strong>Proposed Times:</strong></p>
          <ul>${slotList || "<li>No times provided</li>"}</ul>
          <hr/>
          <p>- TCUTSS System</p>
        `,
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
  const id = Number(requestId);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "requestId must be an integer" });
  }
  const chk = await pool.query('SELECT status FROM emergency_requests WHERE id=$1', [id]);
if (!chk.rowCount) return res.status(404).json({ error: 'Request not found' });
if (chk.rows[0].status !== 'pending') return res.status(409).json({ error: 'Only pending requests can be deleted' });
  try {
    // relies on emergency_request_slots(request_id) ON DELETE CASCADE
    const del = await pool.query(
      "DELETE FROM emergency_requests WHERE id = $1 RETURNING id",
      [id]
    );
    if (del.rowCount === 0) return res.status(404).json({ error: "Request not found" });
    res.status(200).json({ message: "Emergency request deleted", requestId });
  } catch (err) {
    console.error("❌ Error deleting emergency request:", err);
    res.status(500).json({ error: "Failed to delete emergency request" });
  }
});
// /api/emergency/cancel-request
router.patch('/cancel-emergency', async (req, res) => {
  const { requestId, email, name, date, time } = req.body;

  if (!requestId && !(email && date && time)) {
    return res.status(400).json({
      error: "Provide requestId OR email+date+time to cancel the emergency request"
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1) Resolve the target emergency request
    let target;
    if (Number.isInteger(Number(requestId))) {
      const t = await client.query(
        `SELECT id, client_id FROM emergency_requests WHERE id = $1`,
        [Number(requestId)]
      );
      if (!t.rowCount) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Emergency request not found' });
      }
      target = t.rows[0];
    } else {
      // Find by email + slot (most precise)
      const t = await client.query(
        `
        SELECT er.id, er.client_id
          FROM emergency_requests er
          JOIN clients c ON c.id = er.client_id
          JOIN emergency_request_slots ers ON ers.request_id = er.id
         WHERE c.email = $1
           AND ers.slot_date = $2::date
           AND ers.slot_time = $3::time
         ORDER BY er.created_at DESC
         LIMIT 1
        `,
        [email.trim().toLowerCase(), date, time]
      );
      if (!t.rowCount) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Matching emergency request not found for that email/date/time' });
      }
      target = t.rows[0];
    }

    // 2) Cancel the emergency request
    const upd = await client.query(
      `UPDATE emergency_requests
          SET status = 'cancelled'
        WHERE id = $1
        RETURNING id, client_id, status`,
      [target.id]
    );

    // 3) Also cancel any matching *appointment* for that client/slot (if date/time provided)
    if (target.client_id && date && time) {
      await client.query(
        `UPDATE appointments
            SET status = 'cancelled'
          WHERE client_id = $1
            AND service_type = 'Emergency Cut'
            AND appointment_date = $2::date
            AND appointment_time = $3::time`,
        [target.client_id, date, time]
      );

      // 4) Free the slot (optional)
      await client.query(
        `UPDATE available_slots
            SET is_available = TRUE
          WHERE date = $1::date AND time = $2::time`,
        [date, time]
      );
    }

    await client.query('COMMIT');

    // 5) Send email (best-effort)
    try {
      await transporter.sendMail({
        from: `"TCUTSS BARBERSHOP" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Emergency request update",
        html: `<p>Hi ${name || "there"},</p>
               <p>Your emergency request has been <b style="color:red;">cancelled</b>.</p>
               <p>- Barbershop Team</p>`
      });
    } catch (mailErr) {
      console.warn("⚠️ Emergency cancelled, but email failed:", mailErr.message);
    }

    return res.status(200).json({
      message: "Emergency request cancelled",
      request: upd.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("❌ Error cancelling emergency request:", err);
    return res.status(500).json({ error: "Failed to cancel emergency request" });
  } finally {
    client.release();
  }
});



// PATCH /api/emergency/approve-request
// expects { requestId, slot_date, slot_time } from the UI's selectedProposal
router.patch("/approve-request", async (req, res) => {
  const { requestId, slot_date, slot_time } = req.body;
  const id = Number(requestId);
  if (!Number.isInteger(id) || !slot_date || !slot_time) {
    return res.status(400).json({ error: "requestId, slot_date and slot_time are required" });
  }
  const chk = await pool.query('SELECT status FROM emergency_requests WHERE id=$1', [id]);
  if (!chk.rowCount) return res.status(404).json({ error: 'Request not found' });
  if (chk.rows[0].status !== 'pending') return res.status(409).json({ error: 'Only pending requests can be approved' });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock the request row
    const reqRow = await client.query(
      "SELECT id, status, client_id, service_type FROM emergency_requests WHERE id = $1 FOR UPDATE",
      [id]
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
      [id, slot_date, slot_time]
    );
    if (slot.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Selected slot does not belong to this request" });
    }

    // Prevent double-booking
    const conflict = await client.query(
      `SELECT 1
      FROM appointments
      WHERE appointment_date = $1
      AND appointment_time = $2
      AND (status IS NULL OR status <> 'cancelled')
      LIMIT 1`,
      [slot_date, slot_time]
    );
    if (conflict.rowCount) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "That time is already booked" });
    }

    
    const booking = await client.query(
      `INSERT INTO appointments
      (client_id, service_type, appointment_date, appointment_time, status)
      VALUES ($1, $2, $3, $4, 'approved')
      RETURNING *`,
      [reqRow.rows[0].client_id, reqRow.rows[0].service_type, slot_date, slot_time]
    );

    // Mark request approved
    const upd = await client.query(
      "UPDATE emergency_requests SET status = 'approved' WHERE id = $1 RETURNING *",
      [id]
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
router.patch('/cancel-emergency', async (req, res) => {
  const { requestId, email, name } = req.body;
  if (!requestId) return res.status(400).json({ error: "requestId is required" });

  try {
    const upd = await pool.query(
      `UPDATE emergency_requests 
       SET status = 'cancelled'
       WHERE id = $1 RETURNING id, status`,
      [requestId]
    );

    if (upd.rowCount === 0) {
      return res.status(404).json({ error: "Emergency request not found" });
    }

    // send email
    await transporter.sendMail({
      from: `"TCUTSS BARBERSHOP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Emergency request update",
      html: `<p>Hi ${name || "there"},</p>
             <p>Your emergency request has been <b style="color:red;">cancelled</b>.</p>
             <p>- Barbershop Team</p>`
    });

    res.status(200).json({
      message: "Emergency request cancelled",
      request: upd.rows[0]
    });
  } catch (err) {
    console.error("❌ Error cancelling emergency request:", err);
    res.status(500).json({ error: "Failed to cancel emergency request" });
  }
});
module.exports = router;
