const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true
  },
  paidAmount: {
    type: Number,
    required: true,
    min: 0
  },
  dueAmount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);