const express = require('express');
const router = express.Router();
//const { sendConfirmationEmail } = require('../mailer');

router.post('/send-confirmation', async (req, res) => {
    const { name, email } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000); 
    res.status(200).json({ message: "Email sent", code });
    console.log("Email sent", code);
    /*try {
        await sendConfirmationEmail(email, name, code);
        res.status(200).json({ message: "Email sent", code });
    } catch (err) {
        console.error('Email error:', err.message);
        res.status(500).json({ error: "Failed to send email" });
    }*/
});

module.exports = router;