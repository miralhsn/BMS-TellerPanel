require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URL || 'mongodb://localhost:27017/your_database', // ✅ changed key name
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
};
