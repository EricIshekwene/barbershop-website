const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
    console.log("login route hit");
    const { email, password } = req.body;
    console.log(email, password);
    const query = 'SELECT * FROM admins WHERE username = $1';
   try {
    const result = await pool.query(query, [email]);
    //console.log("db hit");
      // console.log(email);
            if (result.rows.length > 0) {
                const hashedPassword = result.rows[0].password_hash;
                const isPasswordValid = await bcrypt.compare(password, hashedPassword);
                if (isPasswordValid) {
                    res.status(200).json({ message: 'Admin logged in successfully' });
                } else {
                    res.status(401).json({ message: 'Invalid email or password' });
                }
                
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
