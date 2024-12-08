const mongoose = require('mongoose');

const chequeSchema = new mongoose.Schema({
  chequeNumber: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  issuingBank: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'rejected', 'cleared'],
    default: 'pending'
  },
  transactionType: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    required: true
  },
  processingDate: Date,
  rejectionReason: String,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cheque', chequeSchema); 