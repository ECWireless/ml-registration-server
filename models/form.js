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
    },
    location: {
        type: String,
        require: true
    },
    day: {
        type: String,
        require: true
    },
    time: {
        type: String,
        require: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Form', formSchema);