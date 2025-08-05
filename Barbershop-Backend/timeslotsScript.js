const { Pool } = require('pg');
const pool = require('./db/pool'); // configure with your .env or directly

const insertHourlySlots = async () => {
  const startDate = new Date();
  const totalDays = 1000;
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00:00`);

  let totalInserted = 0;

  for (let i = 0; i < totalDays; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const dateStr = day.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    for (const time of hours) {
      await pool.query(
        `INSERT INTO available_slots (date, time, is_available)
         VALUES ($1, $2, false)
         ON CONFLICT (date, time) DO NOTHING`,
        [dateStr, time]
      );
      totalInserted++;
    }
  }

  console.log(`Inserted ${totalInserted} time slots.`);
  await pool.end();
};

insertHourlySlots().catch(console.error);
