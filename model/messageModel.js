
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your name"]
    },
    email: {
        type: String,
        required: [true, "Enter you email"]
    },
    message: {
        type: String,
        required: [true, "Enter your message"]
    },

});

module.exports = mongoose.model('Message', messageSchema);