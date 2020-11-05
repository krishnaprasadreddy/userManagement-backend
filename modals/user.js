const mongoose = require('mongoose');
const userschema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "A user must have a name"],
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "A user must have a email"],
        unique: true

    },
    password: {
        type: String,
        required: [true, "password is mandatory"],
        minlength: [8, "password should be atleast of 8 characters"],
        select: false
    },
    phone: {
        type: Number
    }
});

module.exports = mongoose.model('User', userschema);
