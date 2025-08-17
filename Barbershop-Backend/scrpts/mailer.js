// oneTimeMail.js
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '../.env'), // <-- point to backend root .env
  });

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // random subject & body
    const randomId = Math.random().toString(36).slice(2, 10);

    await transporter.sendMail({
      from: `"Barbershop" <${process.env.EMAIL_USER}>`,
      to: "ericlife791@gmail.com",
      subject: `Random message #${randomId}`,
      html: `
        <h3>Hey Eric,</h3>
        <p>This is a one-time random email. Your random code is:</p>
        <h2>${randomId.toUpperCase()}</h2>
      `,
    });

    console.log("✅ Email sent successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    process.exit(1);
  }
})();
