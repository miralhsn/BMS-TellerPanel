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
  {
    path: '/auth',
    route: authRoutes
  },
  {
    path: '/users',
    route: userRoutes
  },
  {
    path: '/customers',
    route: customerRoutes
  },
  {
    path: '/transactions',
    route: transactionRoutes
  },
  {
    path: '/cheques',
    route: chequeRoutes
  },
  {
    path: '/notifications',
    route: notificationRoutes
  }
];

// Register all routes with their prefixes
routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;