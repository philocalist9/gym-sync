const express = require('express');
const cors = require('cors');

const app = express();

// Configure CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  exposedHeaders: ["set-cookie"],
  maxAge: 86400
}));

// Add a test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS is working correctly' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 