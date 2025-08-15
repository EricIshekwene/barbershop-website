const express = require('express');
const router = express.Router();
const pool = require('../db/pool');


router.get('/appointments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM appointments WHERE email_verified = true');
        if (result.rows.length > 0) {
            {/*const clients = result.rows.map(client => ({
        name: client.name,
        phone: client.phone,
        email: client.email,
        instagram: client.instagram ? `@${client.instagram}` : null,
        verified: client.verified // comes from the new column
      }));*/}
      const appointments = result.rows.map(appointment => ({
        name: appointment.name,
        phone: appointment.phone,
        email: appointment.email,
        instagram: appointment.instagram ? `@${appointment.instagram}` : null,
        status: appointment.verified, 
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        service: appointment.service_type
      }));
            res.status(200).json(appointments);
        } else {
            res.status(404).json({ message: "No appointments found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message, message: "Error fetching appointments" });
    }
});


  

module.exports = router;