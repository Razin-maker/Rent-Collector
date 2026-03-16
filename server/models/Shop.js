const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  shopNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tenantName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  rent: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Shop', shopSchema);