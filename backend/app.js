const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const createError = require('http-errors');
const path = require('path');

// Import configuration
const config = require('./config/config');

// Import routes
const routes = require('./routes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Database connection
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('\n🌟 Database Connection Successful!');
    console.log('---------------------------');
    console.log(`📦 Database: MongoDB`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    console.log(`📂 Database Name: ${mongoose.connection.name}`);
    console.log('---------------------------\n');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Basic middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    message: 'API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout'
      },
      users: {
        getProfile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile'
      }
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

// Global error handler
app.use(errorHandler);

// Server information on startup
const displayServerInfo = () => {
  console.log('\n🚀 Server is running!');
  console.log('---------------------------');
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 URL: http://localhost:${config.port}`);
  console.log(`📚 API Docs: http://localhost:${config.port}/api/docs`);
  console.log(`💪 Health: http://localhost:${config.port}/health`);
  console.log('---------------------------');
  console.log('📝 API Endpoints:');
  console.log('   - Auth: /api/auth/*');
  console.log('   - Users: /api/users/*');
  console.log('---------------------------\n');
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM signal received: closing HTTP server');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB connection closed');
    process.exit(0);
  });
});

// Export the app and server info display function
module.exports = { app, displayServerInfo };
