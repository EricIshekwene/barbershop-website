const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const adminLoginRoutes = require('./routes/adminLogin');
const availabilityRoutes = require('./routes/availability');
const submitFormRoutes = require('./routes/submitForm');
const confirmationRoutes = require('./routes/confirmation');
const clientsRoutes = require('./routes/clients');
const appointmentRoutes = require('./routes/appointment');
const emergencyRouter = require('./routes/emergency');
const statsRouter = require('./routes/stats');
require('dotenv').config();

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); 
app.use(cookieParser(process.env.SESSION_SECRET || 'dev-secret'));

// Helper: require admin session via signed cookie
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === 'production';

const requireAdmin = (req, res, next) => {
  try {
    const raw = req.signedCookies?.admin_session;
    if (!raw) return res.status(401).json({ message: 'Unauthorized' });

    // decode base64url JSON { id, iat }
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    const data = JSON.parse(json);
    if (!data?.id || !data?.iat) return res.status(401).json({ message: 'Unauthorized' });

    // Optionally: enforce max age by checking iat
    if (Date.now() - Number(data.iat) > THREE_DAYS_MS) {
      res.clearCookie('admin_session', {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
      });
      return res.status(401).json({ message: 'Session expired' });
    }

    req.admin = { id: data.id };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Register route module
// Public admin auth routes (login/logout/session)
app.use('/api/admin', adminLoginRoutes);

// Protected admin routes
app.use('/api/admin', requireAdmin, availabilityRoutes);
app.use('/api/client', submitFormRoutes);  // Base path for client routes
app.use('/api/confirmation', confirmationRoutes);  // Base path for confirmation routes
app.use('/api/admin', requireAdmin, clientsRoutes);  // Base path for clients routes
app.use('/api/admin', requireAdmin, appointmentRoutes);  // Base path for appointment routes
app.use('/api/emergency', emergencyRouter);  // Base path for emergency routes
app.use('/api/admin', requireAdmin, statsRouter);  // Base path for stats routes

app.listen(PORT, HOST, () => {
    console.log(`Server running:
    - Local:   http://localhost:${PORT}
    - Network: http://<your-computer-IP>:${PORT}`);
  });
