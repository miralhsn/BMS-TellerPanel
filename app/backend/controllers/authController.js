const User = require('../models/User');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const config = require('../config/config');

const authController = {
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        throw createError(401, 'Invalid credentials');
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw createError(401, 'Invalid credentials');
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        config.jwtSecret,
        { expiresIn: '8h' }
      );

      res.json({
        status: 'success',
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  register: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw createError(400, 'Username already exists');
      }

      // Create new user
      const user = new User({
        username,
        password,
        role: 'teller'
      });

      await user.save();

      res.status(201).json({
        status: 'success',
        message: 'Teller registered successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
