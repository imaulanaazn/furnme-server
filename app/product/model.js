const mongoose = require('mongoose');

let productSchema = mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true },
        img: { type: String, required: true },
        categories: { type: Array },
        label: { type: Array },
        price: { type: Number, required: true },
        discount: { type: Number, required: true },
        inStock: { type: Boolean, default: true },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema);