const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

try {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
} catch (err) {
    console.error('❌ Failed to create transporter:', err.message);
}

function sendConfirmationEmail(to, name, code) {
    if (!transporter) {
        throw new Error("Email transporter not initialized");
    }

    return transporter.sendMail({
        from: `"Barbershop" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Booking Confirmation Code",
        html: `
      <h3>Hey ${name},</h3>
      <p>Your confirmation code is: <strong>${code}</strong></p>
      <p>Thanks for booking with us!</p>
    `,
    });
}

module.exports = { sendConfirmationEmail };
