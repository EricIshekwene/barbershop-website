const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/getAvailability', async (req, res) => {
  console.log("getAvailability route hit");
  try {
    const result = await pool.query(`
      SELECT
        s.date,
        EXTRACT(HOUR FROM s.time) AS hour,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM appointments a
            WHERE a.appointment_date = s.date
              AND a.appointment_time = s.time
              AND (a.status IS NULL OR a.status <> 'cancelled')
          ) THEN 'booked'
          WHEN s.is_available THEN 'available'
          ELSE 'unavailable'
        END AS status
      FROM available_slots s
      WHERE s.date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '14 days'
      ORDER BY s.date, hour;
    `);

    const grouped = result.rows.reduce((acc, row) => {
      const dateStr = row.date.toISOString().split('T')[0]; // safe; DB date has no TZ
      const hour = Number(row.hour);
      let day = acc.find(d => d.date === dateStr);
      if (!day) { day = { date: dateStr, timeslots: [] }; acc.push(day); }
      day.timeslots.push({ time: hour, status: row.status }); // <- string now
      return acc;
    }, []);

    res.json(grouped);
    console.log( "available slots", grouped[1].timeslots);
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
