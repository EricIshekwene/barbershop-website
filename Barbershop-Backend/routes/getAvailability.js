const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/getAvailability', async (req, res) => {
    console.log("getAvailability route hit");
  try {
    const result = await pool.query(`
      SELECT date, EXTRACT(HOUR FROM time) AS hour, is_available
      FROM available_slots
      WHERE date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '14 days'
      ORDER BY date, hour;
    `);

    const groupedAvailability = result.rows.reduce((acc, row) => {
      const dateStr = row.date.toISOString().split('T')[0];
      const time = Number(row.hour);
      const status = row.is_available ? "available" : "unavailable";

      let day = acc.find(item => item.date === dateStr);
      if (!day) {
        day = { date: dateStr, timeslots: [] };
        acc.push(day);
      }

      day.timeslots.push({ time, status });
      return acc;
    }, []);

    // ✅ Log for debugging
    console.log("📅 Sending availability (from DB):");
    console.dir(groupedAvailability, { depth: null });

    // ✅ Send the real DB-transformed object
    res.json(groupedAvailability);
  } catch (err) {
    console.error("❌ Error fetching availability:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
