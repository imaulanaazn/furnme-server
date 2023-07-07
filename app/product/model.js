const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    images: [{
        type: String,
        required: true
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    discount: {
        type: Number
    },
    flashSaleStart: {
        type: Date,
    },
    flashSaleEnd: {
        type: Date,
    },
    similarProduct: [{
         type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
  });
  

module.exports = mongoose.model('Product', productSchema);
  