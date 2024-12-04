const express = require('express');
const router = express.Router();

// Import controllers (to be created)
const { login, register, logout } = require('../controllers/authController');

// Import middleware
const { validateLogin, validateRegister } = require('../middleware/validators');

// Auth routes
router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/logout', logout);

module.exports = router;
