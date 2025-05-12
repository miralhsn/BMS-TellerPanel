const Customer = require('../models/Customer');
const createError = require('http-errors');
const mongoose = require('mongoose');
const Cheque = require('../models/Cheque');
const Transaction = require('../models/Transaction');
const emailService = require('../services/emailService');

const customerController = {
  // Search customers
  searchCustomers: async (req, res, next) => {
    try {
      const { query } = req.query;
      
      const customers = await Customer.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { accountNumber: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      }).select('-__v');

      res.json({
        status: 'success',
        data: customers
      });
    } catch (error) {
      next(error);
    }
  },

  // Get customer details
  getCustomerDetails: async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id).select('-__v');
      
      if (!customer) {
        throw createError(404, 'Customer not found');
      }

      res.json({
        status: 'success',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  },

  // Update customer information
  updateCustomerInfo: async (req, res, next) => {
    try {
      const allowedUpdates = ['name', 'email', 'phone', 'address'];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        throw createError(400, 'Invalid updates');
      }

      const customer = await Customer.findById(req.params.id);
      
      if (!customer) {
        throw createError(404, 'Customer not found');
      }

      updates.forEach(update => customer[update] = req.body[update]);
      await customer.save();

      res.json({
        status: 'success',
        data: customer,
        message: 'Customer information updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get transaction history
  getTransactionHistory: async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      
      if (!customer) {
        throw createError(404, 'Customer not found');
      }

      // This is a placeholder. You'll need to implement the actual transaction model and logic
      const transactions = []; // Replace with actual transaction fetch logic

      res.json({
        status: 'success',
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  },

  // Add customer
  addCustomer: async (req, res, next) => {
    try {
      const customerData = req.body;
      
      // Check if account number already exists
      const existingCustomer = await Customer.findOne({ 
        accountNumber: customerData.accountNumber 
      });
      
      if (existingCustomer) {
        throw createError(400, 'Account number already exists');
      }

      const customer = new Customer(customerData);
      await customer.save();

      res.status(201).json({
        status: 'success',
        data: customer,
        message: 'Customer added successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all customers
  getAllCustomers: async (req, res, next) => {
    try {
      const customers = await Customer.find().select('-__v');
      res.json({
        status: 'success',
        data: customers
      });
    } catch (error) {
      next(error);
    }
  },

  // Get quick balance
  getQuickBalance: async (req, res, next) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        throw createError(400, 'Search query is required');
      }

      console.log('Searching for account:', query);

      // Search by account number or customer ID
      const customer = await Customer.findOne({
        $or: [
          { accountNumber: query },
          { _id: mongoose.isValidObjectId(query) ? query : null }
        ]
      });

      if (!customer) {
        throw createError(404, 'Account not found');
      }

      // Get pending transactions (cheques and other pending items)
      const pendingCheques = await Cheque.find({
        customerId: customer._id,
        status: 'pending'
      });

      const pendingBalance = pendingCheques.reduce((total, cheque) => {
        return cheque.transactionType === 'deposit' 
          ? total + cheque.amount 
          : total - cheque.amount;
      }, 0);

      // Get recent transactions
      const recentTransactions = await Transaction.find({
        customerId: customer._id
      })
        .sort({ date: -1 })
        .limit(5)
        .select('type amount date');

      console.log('Found customer:', customer.name);
      console.log('Pending balance:', pendingBalance);
      console.log('Recent transactions:', recentTransactions.length);

      res.json({
        status: 'success',
        data: {
          name: customer.name,
          accountNumber: customer.accountNumber,
          accountType: customer.accountType,
          balance: customer.balance,
          pendingBalance,
          recentTransactions
        }
      });
    } catch (error) {
      console.error('Balance inquiry error:', error);
      next(error);
    }
  },

  // Send statement
  sendStatement: async (req, res, next) => {
    try {
      const { id: customerId } = req.params;
      const { email } = req.body;

      if (!email) {
        throw createError(400, 'Email address is required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw createError(400, 'Invalid email format');
      }

      const customer = await Customer.findById(customerId);
      if (!customer) {
        throw createError(404, 'Customer not found');
      }

      const transactions = await Transaction.find({ customerId })
        .sort({ date: -1 })
        .limit(10)
        .select('type amount date balanceAfter description');

      if (!transactions.length) {
        throw createError(404, 'No transactions found for this customer');
      }

      try {
        const response = await emailService.sendStatementEmail(customer, transactions, email);
        res.json({
          status: 'success',
          message: 'Statement sent successfully',
          messageId: response.messageId
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        throw createError(503, 'Email service temporarily unavailable');
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController; 