const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    name: String,
    userType: String,
    FCM_TOKEN: String,
    city: String,
    state: String,
    phone: String
}, { timestamps: true})

module.exports = mongoose.model('User', dataSchema)