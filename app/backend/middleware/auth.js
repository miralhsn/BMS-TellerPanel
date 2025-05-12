const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const config = require('../config/config');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw createError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(createError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};

module.exports = auth;
