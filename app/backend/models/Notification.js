const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  type: {
    type: String,
    enum: ['cheque', 'transaction'],
    required: true
  },
  status: {
    type: String,
    enum: ['cleared', 'rejected', 'pending', 'success'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  details: {
    chequeId: mongoose.Schema.Types.ObjectId,
    transactionId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    reason: String
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema); 