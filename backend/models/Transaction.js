const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['completed', 'failed', 'pending'],
    default: 'completed'
  },
  description: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  withdrawalMethod: {
    type: String,
    enum: ['cash', 'cheque', null],
    default: null
  }
});

// Generate transaction ID before validation
transactionSchema.pre('validate', function(next) {
  if (!this.transactionId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.transactionId = `TXN${year}${month}${day}${random}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema); 