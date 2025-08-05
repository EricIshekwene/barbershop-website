const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.post('/login', async (req, res) => {
    console.log("login route hit");
    const { email, password } = req.body;
    console.log(email, password);
    const query = 'SELECT * FROM admins WHERE username = $1 and password_hash = $2';
   try {
    const result = await pool.query(query, [email, password]);
    console.log("db hit");
       console.log(email, password);
            if (result.rows.length > 0) {
                res.status(200).json({ message: 'Admin logged in successfully' });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
