const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { createSuperAdmin } = require('./controllers/auth.controller');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const superAdminRoutes = require('./routes/superAdmin');
const gymOwnerRoutes = require('./routes/gymOwner.routes');
const authController = require('./controllers/auth.controller');
const memberRoutes = require('./routes/member');
const notificationRoutes = require('./routes/notification.routes');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, './.env') });

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Enhanced Socket.IO configuration
const io = socketIo(server, {
  cors: {
    // Allow connections from any client (you can restrict this to your domains)
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['authorization', 'content-type']
  },
  // Configure transport
  transports: ['websocket', 'polling'],
  // Allow upgrades to websocket
  allowUpgrades: true,
  // Configure ping timeouts
  pingTimeout: 60000,
  pingInterval: 25000,
  // Connection timeout
  connectTimeout: 30000,
  // Set the path
  path: '/socket.io',
  // Required for some proxy setups
  allowEIO3: true,
  // Log level
  logLevel: 1
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS to fix cross-origin issues with expanded origins
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
      // Add your production domain when ready
      process.env.FRONTEND_URL
    ].filter(Boolean); // Filter out undefined values
    
    // Check if the origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`Origin ${origin} not allowed by CORS`);
      callback(null, true); // Still allow in development for easier testing
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache preflight response for 24 hours
}));

// Handle preflight requests explicitly for all routes
app.options('*', cors());

// Connect to database
connectDB()
  .then(() => {
    console.log('MongoDB connection successful');
    // Create a default super admin if none exists
    createSuperAdmin();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Store active connections
const activeConnections = new Map();

// Socket connection middleware for logging
io.use((socket, next) => {
  console.log(`[${new Date().toISOString()}] Socket connection attempt: ${socket.id}`);
  next();
});

// Socket.io error handling
io.engine.on('connection_error', (err) => {
  console.error(`[${new Date().toISOString()}] Socket.io connection error:`, err);
});

// Socket.io connection handling with enhanced error handling
io.on('connection', (socket) => {
  console.log(`[${new Date().toISOString()}] New client connected: ${socket.id}`);
  
  // Set a timeout for authentication
  const authTimeout = setTimeout(() => {
    console.log(`[${new Date().toISOString()}] Authentication timeout for ${socket.id}`);
    socket.emit('authentication_error', 'Authentication timeout');
    socket.disconnect(true);
  }, 30000); // 30 seconds
  
  // Handle user authentication
  socket.on('authenticate', ({ token }) => {
    console.log(`[${new Date().toISOString()}] Authentication attempt for socket ${socket.id}`);
    
    // Clear the authentication timeout
    clearTimeout(authTimeout);
    
    // Basic validation
    if (!token) {
      console.warn(`[${new Date().toISOString()}] No token provided for socket ${socket.id}`);
      socket.emit('authentication_error', 'No token provided');
      return;
    }
    
    try {
      // Here you should verify the token and get the user ID
      // For now we'll just emit success for testing
      console.log(`[${new Date().toISOString()}] Received authentication token for socket ${socket.id}`);
      
      // Send success response
      socket.emit('authentication_success');
      
      // In a real implementation, you would:
      // 1. Verify the token (e.g., with JWT)
      // 2. Extract user ID and role
      // 3. Store the socket ID with user ID for sending targeted notifications
      // 4. Join relevant rooms based on user role and permissions
      // For example:
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // const userId = decoded.id;
      // activeConnections.set(userId, socket.id);
      // socket.userId = userId;
      // socket.join(`user-${userId}`); // Join a room specific to this user
      // socket.join(decoded.role); // Join a room for the user's role
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Socket authentication error for ${socket.id}:`, error);
      socket.emit('authentication_error', error.message || 'Authentication failed');
    }
  });
  
  // Handle pings for connection health checks
  socket.on('ping', (callback) => {
    console.log(`[${new Date().toISOString()}] Ping received from socket ${socket.id}`);
    if (typeof callback === 'function') {
      callback({ time: new Date().toISOString() });
    }
  });
  
  // Handle errors
  socket.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] Socket error for ${socket.id}:`, error);
  });
  
  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`[${new Date().toISOString()}] Client disconnected: ${socket.id}, reason: ${reason}`);
    
    // Clear any active timeouts
    clearTimeout(authTimeout);
    
    // Clean up resources
    if (socket.userId) {
      activeConnections.delete(socket.userId);
    }
  });
});

// Make io accessible to routes
app.set('io', io);
app.set('activeConnections', activeConnections);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/gym-owner', gymOwnerRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  
  let dbStatusText;
  switch (dbStatus) {
    case 0:
      dbStatusText = 'disconnected';
      break;
    case 1:
      dbStatusText = 'connected';
      break;
    case 2:
      dbStatusText = 'connecting';
      break;
    case 3:
      dbStatusText = 'disconnecting';
      break;
    default:
      dbStatusText = 'unknown';
  }
  
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatusText,
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
