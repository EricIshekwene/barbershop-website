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
        instagram: client.instagram ? `@${client.instagram}` : null,
        verified: client.verified // comes from the new column
      }));
  
      res.status(200).json({count: clients.length, clients: clients});
    } catch (err) {
      console.error("❌ Error fetching verified clients:", err.message);
      res.status(500).json({ error: "Server error fetching verified clients" });
    }
  });
  

module.exports = router;