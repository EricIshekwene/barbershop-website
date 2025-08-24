// routes/admin-dashboard.js
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/dashboard-stats', async (req, res) => {
  const tz = 'America/New_York';

  // optional query params: ?windowDays=7&goal=30
  const windowDays = Math.max(1, Math.min(parseInt(req.query.windowDays || '7', 10), 31));
  const goal = Number.isFinite(+req.query.goal) ? parseInt(req.query.goal, 10) : 30;

  const client = await pool.connect();
  try {
    // Upcoming appointments in local (EST) window, excluding cancelled
    const { rows: appts } = await client.query(
      `
      WITH now_local AS (SELECT now() AT TIME ZONE $1 AS ts)
      SELECT
        a.appointment_date,        -- "YYYY-MM-DD"
        a.appointment_time,        -- "HH:MM:SS"
        a.status
      FROM appointments a, now_local n
      WHERE (a.status IS NULL OR a.status <> 'cancelled')
        AND (a.appointment_date::timestamp + a.appointment_time)
              >= date_trunc('day', n.ts)
        AND (a.appointment_date::timestamp + a.appointment_time)
              <  date_trunc('day', n.ts) + ($2 || ' days')::interval
      ORDER BY a.appointment_date, a.appointment_time
      `,
      [tz, String(windowDays)]
    );

    // Cuts completed THIS MONTH (treating "approved/completed/done" as completed)
    const { rows: cutsRows } = await client.query(
      `
      WITH now_local AS (SELECT now() AT TIME ZONE $1 AS ts)
      SELECT COUNT(*)::int AS completed
      FROM appointments a, now_local n
      WHERE a.status IN ('approved','completed','done')
        AND date_trunc('month', a.appointment_date::timestamp)
            = date_trunc('month', n.ts)
      `,
      [tz]
    );
    const completed = cutsRows[0]?.completed ?? 0;

    // Helper for weekly new-users bins over the last N months
    async function buildNewUsers(months) {
      const { rows } = await client.query(
        `
        WITH now_local AS (SELECT now() AT TIME ZONE $1 AS ts),
        bounds AS (
          SELECT
            (date_trunc('day', n.ts) - ($2 || ' months')::interval) AS start_ts,
            date_trunc('day', n.ts) AS end_ts
          FROM now_local n
        ),
        weeks AS (
          SELECT generate_series(
            date_trunc('week', start_ts),
            date_trunc('week', end_ts) - interval '1 week',
            interval '1 week'
          ) AS week_start
          FROM bounds
        ),
        counts AS (
          SELECT
            date_trunc('week', (c.created_at AT TIME ZONE $1)) AS week_start,
            COUNT(*)::int AS cnt
          FROM clients c, bounds b
          WHERE c.email_verified = true
            AND (c.created_at AT TIME ZONE $1) >= b.start_ts
            AND (c.created_at AT TIME ZONE $1) <  b.end_ts
          GROUP BY 1
        )
        SELECT w.week_start, COALESCE(c.cnt,0) AS cnt
        FROM weeks w
        LEFT JOIN counts c USING (week_start)
        ORDER BY w.week_start
        `,
        [tz, String(months)]
      );
      const weekly = rows.map(r => Number(r.cnt) || 0);
      const total = weekly.reduce((a, b) => a + b, 0);
      return { total, weekly };
    }

    const nu1 = await buildNewUsers(1);
    const nu2 = await buildNewUsers(2);
    const nu3 = await buildNewUsers(3);

    res.json({
      appointments: appts,
      cuts: { completed, goal },
      newUsers: { "1m": nu1, "2m": nu2, "3m": nu3 }
    });
  } catch (err) {
    console.error('❌ dashboard-stats error:', err);
    res.status(500).json({ error: 'Failed to build dashboard stats' });
  } finally {
    client.release();
  }
});

module.exports = router;
