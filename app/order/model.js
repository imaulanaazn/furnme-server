const mongoose = require("mongoose");

const OrderSchema =  mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    note: String,
    amount: { type: Number, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: Object, required: true },
    city: { type: String, required: true },
    bankName: { type: String, required: true },
    bankNumber: { type: Number, required: true },
    state: { type: String, required: true },
    zipcode: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);