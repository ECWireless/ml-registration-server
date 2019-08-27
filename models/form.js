const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Form', formSchema);