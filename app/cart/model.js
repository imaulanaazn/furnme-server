const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      images: [{
        type: String,
        required: true
      }],
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cart', cartSchema);
