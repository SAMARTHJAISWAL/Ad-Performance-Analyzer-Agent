require('dotenv').config();
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5005; // Use port 5005 or the environment-defined port

app.use(cors());

// Middleware
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const uploadRoutes = require('./routes/upload');
const analyzeRoutes = require('./routes/analyze');

// Register Routes
app.use('/api/upload', uploadRoutes); // Register upload routes
app.use('/api/analyze', analyzeRoutes); // Register analyze routes

// Root route (for testing)
app.get('/', (req, res) => {
    res.send('Root Route Works');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
