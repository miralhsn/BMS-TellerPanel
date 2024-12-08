const Transaction = require('../models/Transaction');
const Customer = require('../models/Customer');
const createError = require('http-errors');
const emailService = require('../services/emailService');
const TRANSACTION_LIMITS = require('../config/constants');
const moment = require('moment');

const transactionController = {
  processTransaction: async (req, res, next) => {
    try {
      const { customerId, type, amount, description, withdrawalMethod } = req.body;
      
      if (!customerId || !type || !amount) {
        throw createError(400, 'Missing required fields');
      }

      // Find customer and validate
      const customer = await Customer.findById(customerId);
      if (!customer) {
        throw createError(404, 'Customer not found');
      }

      // Validate withdrawal amount and limits
      if (type === 'withdrawal') {
        // Check if sufficient funds
        if (customer.balance < amount) {
          throw createError(400, 'Insufficient funds');
        }

        // Validate withdrawal method limits
        if (withdrawalMethod === 'cash') {
          // Check cash withdrawal limit
          if (amount > TRANSACTION_LIMITS.CASH.MAX_AMOUNT) {
            throw createError(400, `Cash withdrawal limit is $${TRANSACTION_LIMITS.CASH.MAX_AMOUNT}`);
          }

          // Check hourly withdrawal frequency
          const oneHourAgo = moment().subtract(1, 'hour');
          const recentWithdrawals = await Transaction.countDocuments({
            customerId,
            type: 'withdrawal',
            withdrawalMethod: 'cash',
            date: { $gte: oneHourAgo.toDate() }
          });

          if (recentWithdrawals >= TRANSACTION_LIMITS.CASH.MAX_WITHDRAWALS_PER_HOUR) {
            throw createError(400, 'Maximum withdrawals per hour exceeded. Please try again later.');
          }
        } else if (withdrawalMethod === 'cheque') {
          // Check cheque withdrawal limit
          if (amount > TRANSACTION_LIMITS.CHEQUE.MAX_AMOUNT) {
            throw createError(400, `Cheque withdrawal limit is $${TRANSACTION_LIMITS.CHEQUE.MAX_AMOUNT}`);
          }
        }
      }

      // Calculate new balance
      const newBalance = type === 'deposit' 
        ? customer.balance + parseFloat(amount) 
        : customer.balance - parseFloat(amount);

      // Create transaction
      const transaction = new Transaction({
        customerId,
        type,
        amount: parseFloat(amount),
        balanceAfter: newBalance,
        description,
        withdrawalMethod: type === 'withdrawal' ? withdrawalMethod : null,
        performedBy: req.user.id
      });

      try {
        // Save transaction first
        await transaction.save();
        
        // Update customer balance
        customer.balance = newBalance;
        await customer.save();

        res.status(201).json({
          status: 'success',
          data: {
            transaction,
            newBalance
          }
        });
      } catch (saveError) {
        console.error('Save error:', saveError);
        if (transaction._id) {
          await Transaction.findByIdAndDelete(transaction._id);
        }
        throw createError(500, 'Transaction failed. Please try again.');
      }
    } catch (error) {
      next(error);
    }
  },

  getTransactionHistory: async (req, res, next) => {
    try {
      const { customerId } = req.params;
      
      if (!customerId) {
        throw createError(400, 'Customer ID is required');
      }

      const transactions = await Transaction.find({ customerId })
        .sort({ date: -1 })
        .select('-__v');

      res.json({
        status: 'success',
        data: transactions
      });
    } catch (error) {
      console.error('Get transaction history error:', error);
      next(error);
    }
  },

  sendReceipt: async (req, res, next) => {
    try {
      const { transactionId } = req.params;
      const { email } = req.body;

      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw createError(404, 'Transaction not found');
      }

      const customer = await Customer.findById(transaction.customerId);
      if (!customer) {
        throw createError(404, 'Customer not found');
      }

      await emailService.sendTransactionReceipt(transaction, customer, email);

      res.json({
        status: 'success',
        message: 'Receipt sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = transactionController; 