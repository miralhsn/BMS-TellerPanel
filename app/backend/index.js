// index.js
require('dotenv').config();

const { app, displayServerInfo } = require('./app');
const config = require('./config/config');

const PORT = config.port || 5000;

app.listen(PORT, '0.0.0.0', () => {
  displayServerInfo();
});
