const express = require('express');
const router = express.Router();

// Import controllers (to be created)
const { getProfile, updateProfile } = require('../controllers/userController');

// Import middleware
const auth = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validators');

// User routes
router.get('/profile', auth, getProfile);
router.put('/profile', [auth, validateProfileUpdate], updateProfile);

module.exports = router;
