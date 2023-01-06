const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: String,
    picture: String,
    email: {
        type: String, 
        required: [true, "email harus diisi"]
    },
    password: String,
    googleData: {
        email : String,
        family_name : String,
        given_name :String,
        id :String,
        locale :String,
        name :String,
        picture :String,
        verified_email :Boolean,
    }
}, {timestamps: true});

module.exports = mongoose.model('User',userSchema)

