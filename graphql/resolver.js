const userController = require('./../controllers/userController')
const followController = require('./../controllers/followController')
const publishController = require('./../controllers/publishController');
const commentController = require('./../controllers/commentController');
const likeController = require('./../controllers/likeController');

const resolver = {
  Query: {
    //User
    getUser: userController.getUser,
    search: userController.search,
    //Follow
    isFollow: followController.isFollow,
    getFollowers: followController.getFollowers,
    getFolloweds: followController.getFolloweds,
    getNotFolloweds: followController.getNotFolloweds,
    //Publicaions
    getPublications: publishController.getPublications,
    getPublicationsFollowers: publishController.getPublicationsFollowers,
    //Comments
    getComments: commentController.getComments,
    //Like
    isLike: likeController.isLike,
    countLikes: likeController.countLikes
  },
  Mutation: {
    //User
    register: userController.register,
    login: userController.login,
    updateAvatar: userController.updateAvatar,
    deleteAvatar: userController.deleteAvatar,
    updateUser: userController.updateUser,
    //Follow
    follow: followController.follow,
    unFollow: followController.unFollow,
    //Publish
    publish: publishController.publish,
    //Comment
    addComment: commentController.addComment,
    //Like
    addLike: likeController.addLike,
    removeLike: likeController.removeLike
  }
};

module.exports = resolver;
