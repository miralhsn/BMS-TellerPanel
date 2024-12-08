const express = require('express');
const router = express.Router();
const chequeController = require('../controllers/chequeController');
const auth = require('../middleware/auth');

router.post('/submit', auth, chequeController.submitCheque);
router.put('/process/:chequeId', auth, chequeController.processCheque);
router.get('/', auth, chequeController.getCheques);

// Add this route for testing
router.get('/test', (req, res) => {
  res.json({ message: 'Cheque routes are working' });
});

module.exports = router; 