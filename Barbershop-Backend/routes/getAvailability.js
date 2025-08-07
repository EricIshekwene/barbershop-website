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
   // console.dir(groupedAvailability, { depth: null });

    // ✅ Send the real DB-transformed object
    // Example structure of groupedAvailability:
    /*
    [
      {
        date: "2024-06-10",
        timeslots: [
          { time: 10, status: "available" },
          { time: 11, status: "unavailable" },
          // ...
        ]
      },
      {
        date: "2024-06-11",
        timeslots: [
          { time: 10, status: "available" },
          // ...
        ]
      },
      // ...
    ]
    */
    res.json(groupedAvailability);
  } catch (err) {
    console.error("❌ Error fetching availability:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/updateAvailability', async (req, res) => {
    console.log("updateAvailability route hit");
    const { date, timeslots } = req.body;
    
    //console.log(date, timeslots);
    if (!date || !Array.isArray(timeslots)) {
        return res.status(400).json({ error: "Invalid request format" });
      }
      try {
        for (const slot of timeslots) {
            const isAvailable = slot.status === 'available';
            console.log(`Updating ${date} @ hour ${slot.time} to ${isAvailable}`);
          
            const result = await pool.query(
                `UPDATE available_slots
                 SET is_available = $1
                 WHERE date = $2 AND time = make_time($3, 0, 0)::time`,
                [isAvailable, date, slot.time]
              );
          
            console.log(`Update result: ${result.rowCount} rows affected`);
          }
          
    
        res.json({ message: "Availability updated successfully" });
      } catch (err) {
        console.error("❌ Error updating availability:", err);
        res.status(500).json({ error: "Internal server error" });
      }
});



module.exports = router;
