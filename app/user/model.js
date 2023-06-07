const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: String,
    googleId: String,
    likedProducts: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }],
   carts: [{
      type: Schema.Types.ObjectId,
      ref: 'Cart'
    }],
    recentlyViewed: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }]
  });
  
module.exports = mongoose.model('User', userSchema);