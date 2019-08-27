const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    createdForm: {
        type: Schema.Types.ObjectId,
        ref: 'Form'
    }
});

module.exports = mongoose.model('User', userSchema);