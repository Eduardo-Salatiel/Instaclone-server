const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = Schema({
    idPublication: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Publication"
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    comment: {
        type: String,
        trim: true,
        require: true
    },
    createAt:{
    type: Date,
    default: Date.now()
    }
});

module.exports = mongoose.model("Comments", CommentsSchema);
