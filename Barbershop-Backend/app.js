const express = require('express');
const cors = require('cors');
const adminLoginRoutes = require('./routes/adminLogin');
const getAvailabilityRoutes = require('./routes/getAvailability');
const submitFormRoutes = require('./routes/submitForm');
const confirmationRoutes = require('./routes/confirmation');
const clientsRoutes = require('./routes/clients');

require('dotenv').config();

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); // Parses incoming JSON

// Register route module
app.use('/api/admin', adminLoginRoutes);  // Base path for admin routes
app.use('/api/admin', getAvailabilityRoutes);  // Base path for admin routes
app.use('/api/client', submitFormRoutes);  // Base path for client routes
app.use('/api/confirmation', confirmationRoutes);  // Base path for confirmation routes
app.use('/api/admin', clientsRoutes);  // Base path for clients routes

app.listen(PORT, HOST, () => {
    console.log(`Server running:
    - Local:   http://localhost:${PORT}
    - Network: http://<your-computer-IP>:${PORT}`);
  });