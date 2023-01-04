const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: String,
    email: String,
}, {timestamps: true});

module.exports = mongoose.model('User',userSchema)

