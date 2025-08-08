const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.post('/addClient', async (req, res) => {
  const { name, email, phone, instagram } = req.body;
  console.log("client route hit");

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }

  const normEmail = String(email).trim().toLowerCase();

  try {
    // 1️⃣ Check if email already exists AND is verified
    const verifiedEmailResult = await pool.query(
      `SELECT * FROM clients WHERE email = $1 AND email_verified = true LIMIT 1`,
      [normEmail]
    );

    if (verifiedEmailResult.rows.length > 0) {
      return res.status(200).json({
        message: 'Email already verified',
        verified: true,
        client: verifiedEmailResult.rows[0],
      });
    }
    // 2️⃣ Check if email exists but is unverified and update the record with the latest info
    const unverifiedEmailResult = await pool.query(
        `SELECT * FROM clients WHERE email = $1 AND email_verified = false LIMIT 1`,
        [normEmail]
      );

      
  if (unverifiedEmailResult.rows.length > 0) {
    // Update the existing record with the latest info
    const updateResult = await pool.query(
      `UPDATE clients
       SET name = $1,
           phone = $2,
           instagram = COALESCE($3, instagram)
       WHERE email = $4
       RETURNING *`,
      [name, phone, instagram || null, normEmail]
    );

    return res.status(201).json({
      message: 'Unverified client updated with latest info',
      verified: false,
      client: updateResult.rows[0],
    });
  }

    // 3️⃣ If email doesn't exist, create a new unverified row
    const insertResult = await pool.query(
        `INSERT INTO clients (name, email, phone, instagram)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE
           SET name = EXCLUDED.name,
               phone = EXCLUDED.phone,
               instagram = COALESCE(EXCLUDED.instagram, clients.instagram)
         RETURNING *`,
        [name, email, phone, instagram || null] // email can be in any case
      );
      

    return res.status(201).json({
      message: 'Client created/updated, needs verification',
      verified: false,
      client: insertResult.rows[0],
    });

  } catch (err) {
    console.error('❌ Error inserting client:', err.message);
    return res.status(500).json({ error: 'Server error while creating client' });
  }
});

module.exports = router;
