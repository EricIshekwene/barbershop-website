const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.post('/addNewClient', async (req, res) => {
    const { name, email, phone, instagram } = req.body;
    console.log("client route hit");

    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    try {
        // Check if any record exists with 2 out of 3 matching fields
        const checkQuery = `
            SELECT * FROM clients
            WHERE 
                (name = $1 AND email = $2) OR
                (name = $1 AND phone = $3) OR
                (email = $2 AND phone = $3)
            LIMIT 1
        `;
        const checkResult = await pool.query(checkQuery, [name, email, phone]);

        if (checkResult.rows.length > 0) {
            return res.status(409).json({ error: 'Client already exists with matching details' });
        }

        // Insert the new client
        const insertQuery = `
            INSERT INTO clients (name, email, phone, instagram)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const insertResult = await pool.query(insertQuery, [name, email, phone, instagram || null]);
        const newClient = insertResult.rows[0];

        console.log('✅ Client created:', newClient);
        return res.status(201).json({ message: 'Client created successfully', client: newClient });

    } catch (err) {
        console.error('❌ Error inserting client:', err.message);
        return res.status(500).json({ error: 'Server error while creating client' });
    }
});

module.exports = router;
