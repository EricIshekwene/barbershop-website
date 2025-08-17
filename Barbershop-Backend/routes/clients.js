const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

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
module.exports = router;