const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./auth');
const userRoutes = require('./user');

// Define route prefixes
const routes = [
  {
    path: '/auth',
    route: authRoutes
  },
  {
    path: '/users',
    route: userRoutes
  }
  // Add new routes here
];

// Register all routes with their prefixes
routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;