const express = require('express');
const cors = require('cors');
const adminLoginRoutes = require('./routes/adminLogin');
const getAvailabilityRoutes = require('./routes/getAvailability');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); // Parses incoming JSON

// Register route module
app.use('/api/admin', adminLoginRoutes);  // Base path for admin routes
app.use('/api/admin', getAvailabilityRoutes);  // Base path for admin routes

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});