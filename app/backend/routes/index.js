const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./auth');
const userRoutes = require('./user');
const customerRoutes = require('./customer');
const transactionRoutes = require('./transaction');
const chequeRoutes = require('./cheque');
const notificationRoutes = require('./notification');

// Define route prefixes
const routes = [
  { path: '/auth', route: authRoutes },
  { path: '/users', route: userRoutes },
  { path: '/customers', route: customerRoutes },
  { path: '/transactions', route: transactionRoutes },
  { path: '/cheques', route: chequeRoutes },
  { path: '/notifications', route: notificationRoutes }
];

// Register all routes
routes.forEach((r) => {
  router.use(r.path, r.route);
});

module.exports = router;
