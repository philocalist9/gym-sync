const express = require('express');
const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 