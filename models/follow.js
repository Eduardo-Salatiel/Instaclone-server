const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    follow: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Follow', followSchema)