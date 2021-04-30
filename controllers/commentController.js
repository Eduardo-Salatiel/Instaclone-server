const user = require('../models/user');
const Comment = require('./../models/comments');

exports.addComment = async(_,{input}, ctx) => {
    const { id } = ctx.user;
    try {
        console.log(input.comment)
        const comment = new Comment({
            idPublication: input.idPublication,
            idUser: id,
            comment: input.comment
        });
        await comment.save();

        return comment;
    } catch (error) {
        console.log(error);
    }
}

exports.getComments = async(_,{idPublication}) => {
    const comments = await Comment.find({idPublication}).populate("idUser");
    return comments
}