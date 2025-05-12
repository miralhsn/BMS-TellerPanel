const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.post('/process', auth, transactionController.processTransaction);
router.get('/history/:customerId', auth, transactionController.getTransactionHistory);
router.post('/:transactionId/receipt', auth, transactionController.sendReceipt);

module.exports = router; 