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
      from: `"TCUTSS BARBERSHOP" <${process.env.EMAIL_USER}>`,
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
    const from = `"TCUTSS BARBERSHOP" <${process.env.EMAIL_USER}>`;

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

router.patch('/approve-appointment', async (req, res) => {
  try {
    const { name, email, date, time, service } = req.body;

    if (!name || !email || !date || !time || !service) {
      return res.status(400).json({ error: "name, email, date, time, and service are required" });
    }

    const result = await pool.query(
      `UPDATE appointments
       SET status = 'approved'
       WHERE name = $1 AND email = $2 AND appointment_date = $3 AND appointment_time = $4 AND service_type = $5`,
      [name, email, date, time, service]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No matching appointment found to approve" });
    }

    // Format date and time nicely
    const prettyDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // assume `time` is like "15:00:00"
    const [hh = "0", mm = "0"] = time.split(":");
    const dt = new Date(date);
    dt.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
    const prettyTime = dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    // Try sending the email
    try {
      const subject = "Your Appointment Has Been Approved ✅";
      const message = `Hi ${name},\n\nYour appointment for "${service}" on ${prettyDate} at ${prettyTime} has been approved.\n\nWe look forward to seeing you!\n\n- Barbershop`;

      await transporter.sendMail({
        from: `"TCUTSS BARBERSHOP" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text: message,
        html: `<p>Hi ${name},</p>
               <p>Your appointment for <strong>${service}</strong> on <strong>${prettyDate}</strong> at <strong>${prettyTime}</strong> has been <span style="color:green;font-weight:bold;">approved</span>.</p>
               <p>We look forward to seeing you!</p>
               <p>- Barbershop</p>`,
      });

      return res.status(200).json({ message: "Appointment approved and email sent successfully" });
    } catch (emailErr) {
      console.error("⚠️ Appointment approved but email failed:", emailErr.message);
      return res.status(200).json({
        message: "Appointment approved, but failed to send email",
        emailError: emailErr.message
      });
    }

  } catch (err) {
    console.error("❌ Error approving appointment:", err.message);
    return res.status(500).json({ error: "Server error approving appointment" });
  }
});

router.delete('/cancel-appointment', async (req, res) => {
  try {
    const { name, email, date, time, service } = req.body;

    if (!name || !email || !date || !time || !service) {
      return res.status(400).json({ error: "name, email, date, time, and service are required" });
    }

    const result = await pool.query(
      `DELETE FROM appointments
       WHERE name = $1 AND email = $2 AND appointment_date = $3 AND appointment_time = $4 AND service_type = $5`,
      [name, email, date, time, service]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No matching appointment found to cancel" });
    }
    const result2 = await pool.query(
      `UPDATE available_slots
       SET is_available = TRUE
       WHERE date = $1 AND time = $2::time`,
      [date, time]
    );
    if (result2.rowCount === 0) {
      console.error("⚠️ No matching slot found to update");
      return res.status(404).json({ error: "No matching slot found to update" });
    }
    // Format date and time nicely
    const prettyDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const [hh = "0", mm = "0"] = time.split(":");
    const dt = new Date(date);
    dt.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
    const prettyTime = dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    // Try sending the email
    try {
      const subject = "Your Appointment Has Been Cancelled ❌";
      const message = `Hi ${name},\n\nYour appointment for "${service}" on ${prettyDate} at ${prettyTime} has been cancelled.\n\nIf this was a mistake, please reschedule.\n\n- Barbershop`;

      await transporter.sendMail({
        from: `"TCUTSS BARBERSHOP" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text: message,
        html: `<p>Hi ${name},</p>
               <p>Your appointment for <strong>${service}</strong> on <strong>${prettyDate}</strong> at <strong>${prettyTime}</strong> has been <span style="color:red;font-weight:bold;">cancelled</span>.</p>
               <p>If this was a mistake, please reschedule.</p>
               <p>- Barbershop</p>`,
      });

      return res.status(200).json({ message: "Appointment cancelled and email sent successfully" });
    } catch (emailErr) {
      console.error("⚠️ Appointment cancelled but email failed:", emailErr.message);
      return res.status(200).json({
        message: "Appointment cancelled, but failed to send email",
        emailError: emailErr.message
      });
    }

  } catch (err) {
    console.error("❌ Error cancelling appointment:", err.message);
    return res.status(500).json({ error: "Server error cancelling appointment" });
  }
});

router.delete('/delete-client', async (req, res) => {
  const { client } = req.body || {};
  if (!client?.email) return res.status(400).json({ error: 'client email required' });

  const pg = await pool.connect();
  try {
    await pg.query('BEGIN');

    // 1) Resolve client id
    const { rows } = await pg.query(
      `SELECT id FROM clients WHERE email = $1 AND email_verified = true LIMIT 1`,
      [client.email.trim().toLowerCase()]
    );
    if (rows.length === 0) {
      await pg.query('ROLLBACK');
      return res.status(404).json({ error: 'Client not found' });
    }
    const clientId = rows[0].id;

    // 2) Delete appointments (regular + emergency-created alike)
    const apptDel = await pg.query(
      `DELETE FROM appointments WHERE client_id = $1 RETURNING id`,
      [clientId]
    );

    // 3) Delete emergency request slots for this client's requests
    const slotsDel = await pg.query(
      `DELETE FROM emergency_request_slots
         WHERE request_id IN (SELECT id FROM emergency_requests WHERE client_id = $1)
       RETURNING id`,
      [clientId]
    );

    // 4) Delete emergency requests for this client
    const reqsDel = await pg.query(
      `DELETE FROM emergency_requests WHERE client_id = $1 RETURNING id`,
      [clientId]
    );

    // 5) Finally delete the client
    const clientDel = await pg.query(
      `DELETE FROM clients WHERE id = $1 RETURNING id`,
      [clientId]
    );
    if (clientDel.rowCount === 0) {
      await pg.query('ROLLBACK');
      return res.status(404).json({ error: 'Client not found' });
    }

    await pg.query('COMMIT');
    return res.status(200).json({
      message: 'Client and related data deleted',
      counts: {
        appointmentsDeleted: apptDel.rowCount,
        emergencySlotsDeleted: slotsDel.rowCount,
        emergencyRequestsDeleted: reqsDel.rowCount,
        clientsDeleted: clientDel.rowCount,
      }
    });
  } catch (err) {
    await pg.query('ROLLBACK');
    console.error('❌ Error deleting client:', err);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    pg.release();
  }
});
router.post('/resend-email', async (req, res) => {
  const { name, email, confirmationCode } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    await transporter.sendMail({
      from: `"TCUTSS BARBERSHOP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Confirmation Code",
      html: `<p>Hi ${name || "there"},</p>
             <p>Here is your confirmation code: ${confirmationCode}.</p>
             <p>- Barbershop Team</p>`
    });

    res.status(200).json({ message: "Confirmation email resent" });
  } catch (err) {
    console.error("❌ Error resending email:", err);
    res.status(500).json({ error: "Failed to resend email" });
    console.log(err);
  }
});


module.exports = router;