const Cheque = require('../models/Cheque');
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const createError = require('http-errors');

const chequeController = {
  submitCheque: async (req, res, next) => {
    try {
      const {
        chequeNumber,
        amount,
        issuingBank,
        issueDate,
        customerId,
        transactionType,
        notes
      } = req.body;

      // Validate customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
        throw createError(404, 'Customer not found');
      }

      // Check for duplicate cheque number
      const existingCheque = await Cheque.findOne({ chequeNumber });
      if (existingCheque) {
        throw createError(400, 'Cheque number already processed');
      }

      const cheque = new Cheque({
        chequeNumber,
        amount: parseFloat(amount),
        issuingBank,
        issueDate: new Date(issueDate),
        customerId,
        transactionType,
        notes,
        processedBy: req.user.id
      });

      await cheque.save();

      res.status(201).json({
        status: 'success',
        data: cheque
      });
    } catch (error) {
      next(error);
    }
  },

  processCheque: async (req, res, next) => {
    try {
      const { chequeId } = req.params;
      const { status, rejectionReason } = req.body;

      const cheque = await Cheque.findById(chequeId);
      if (!cheque) {
        throw createError(404, 'Cheque not found');
      }

      if (cheque.status !== 'pending') {
        throw createError(400, 'Cheque already processed');
      }

      const customer = await Customer.findById(cheque.customerId);
      if (!customer) {
        throw createError(404, 'Customer not found');
      }

      cheque.status = status;
      cheque.processingDate = new Date();
      cheque.rejectionReason = rejectionReason;

      if (status === 'cleared') {
        // Create transaction and update balance
        const newBalance = cheque.transactionType === 'deposit'
          ? customer.balance + cheque.amount
          : customer.balance - cheque.amount;

        if (cheque.transactionType === 'withdrawal' && customer.balance < cheque.amount) {
          throw createError(400, 'Insufficient funds');
        }

        const transaction = new Transaction({
          customerId: customer._id,
          type: cheque.transactionType,
          amount: cheque.amount,
          balanceAfter: newBalance,
          description: `Cheque ${cheque.chequeNumber} processed`,
          performedBy: req.user.id
        });

        customer.balance = newBalance;

        await Promise.all([
          transaction.save(),
          customer.save(),
          cheque.save()
        ]);
      } else {
        await cheque.save();
      }

      res.json({
        status: 'success',
        data: cheque
      });
    } catch (error) {
      next(error);
    }
  },

  getCheques: async (req, res, next) => {
    try {
      const { customerId, status } = req.query;
      console.log('Getting cheques for customer:', customerId);

      const query = {};
      if (customerId) query.customerId = customerId;
      if (status) query.status = status;

      const cheques = await Cheque.find(query)
        .sort({ createdAt: -1 })
        .populate('customerId', 'name accountNumber');

      console.log('Found cheques:', cheques.length);

      res.json({
        status: 'success',
        data: cheques
      });
    } catch (error) {
      console.error('Error getting cheques:', error);
      next(error);
    }
  }
};

module.exports = chequeController; 