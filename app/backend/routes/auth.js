const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for login
router.post('/login', authController.login);

// Route for register
router.post('/register', authController.register);

module.exports = router;

