const express = require('express');
const cors = require('cors');
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

// Register route module
app.use('/api/admin', adminLoginRoutes);  // Base path for admin routes
app.use('/api/admin', availabilityRoutes);  // Base path for admin routes
app.use('/api/client', submitFormRoutes);  // Base path for client routes
app.use('/api/confirmation', confirmationRoutes);  // Base path for confirmation routes
app.use('/api/admin', clientsRoutes);  // Base path for clients routes
app.use('/api/admin', appointmentRoutes);  // Base path for appointment routes
app.use('/api/emergency', emergencyRouter);  // Base path for emergency routes
app.use('/api/admin', statsRouter);  // Base path for stats routes

app.listen(PORT, HOST, () => {
    console.log(`Server running:
    - Local:   http://localhost:${PORT}
    - Network: http://<your-computer-IP>:${PORT}`);
  });