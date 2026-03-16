const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  month: {
    type: String,
    required: true,
    trim: true
  },
  rent: {
    type: Number,
    required: true,
    min: 0
  },
  electricity: {
    type: Number,
    required: true,
    min: 0
  },
  water: {
    type: Number,
    required: true,
    min: 0
  },
  otherCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);