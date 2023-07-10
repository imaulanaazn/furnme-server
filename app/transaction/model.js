const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  paymentMethod: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending',
  },
  shippingAddress: {
    // Define the structure for the shipping address fields
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  billingAddress: {
    // Define the structure for the billing address fields
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  additionalDetails: {
    type: String,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
