const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const bcrypt = require('bcryptjs');

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === 'production';

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
                    const adminId = result.rows[0].id;
                    const payload = { id: adminId, iat: Date.now() };
                    const value = Buffer.from(JSON.stringify(payload)).toString('base64url');
                    res.cookie('admin_session', value, {
                        httpOnly: true,
                        sameSite: 'lax',
                        secure: isProduction,
                        maxAge: THREE_DAYS_MS,
                        signed: true,
                    });
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

// GET /api/admin/session -> check if logged in
router.get('/session', (req, res) => {
    try {
        const raw = req.signedCookies?.admin_session;
        if (!raw) return res.status(401).json({ authenticated: false });
        const json = Buffer.from(raw, 'base64url').toString('utf8');
        const data = JSON.parse(json);
        if (!data?.id || !data?.iat) return res.status(401).json({ authenticated: false });
        return res.json({ authenticated: true, adminId: data.id });
    } catch (e) {
        return res.status(401).json({ authenticated: false });
    }
});

// POST /api/admin/logout -> clear cookie
router.post('/logout', (req, res) => {
    res.clearCookie('admin_session', {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
    });
    res.json({ message: 'Logged out' });
});

module.exports = router;
