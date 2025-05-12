require('dotenv').config();
const { app, displayServerInfo } = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  displayServerInfo();
});