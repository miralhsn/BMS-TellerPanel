const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');
const createError = require('http-errors');
const emailService = require('../services/emailService');

// Balance inquiry route should come before other routes with parameters
router.get('/balance-inquiry', auth, customerController.getQuickBalance);

// Search customers
router.get('/search', auth, customerController.searchCustomers);

// Get all customers
router.get('/', auth, customerController.getAllCustomers);

// Get customer details
router.get('/:id', auth, customerController.getCustomerDetails);

// Update customer information
router.put('/:id', auth, customerController.updateCustomerInfo);

// Get customer transaction history
router.get('/:id/transactions', auth, customerController.getTransactionHistory);

// Add customer
router.post('/', auth, customerController.addCustomer);

// Send statement
router.post('/:id/send-statement', auth, customerController.sendStatement);

// Add this route for testing email service
router.post('/test-email', auth, async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      throw createError(400, 'Email address is required');
    }

    await emailService.sendTestEmail(email);
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    next(createError(500, 'Failed to send test email'));
  }
});

module.exports = router; 