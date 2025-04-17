// backend/config.js
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'gymSyncSecret',
  jwtExpiration: '1d', // 1 day
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/gymsync'
}; 