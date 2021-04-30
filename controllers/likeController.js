const Like = require("./../models/likes");

exports.addLike = async (_, { idPublication }, ctx) => {
  try {
    const like = new Like({
      idPublication,
      idUser: ctx.user.id,
    });
    await like.save();
    return true;
  } catch (error) {
    return false;
  }
};

exports.removeLike = async (_, { idPublication }, ctx) => {
  try {
    await Like.findOneAndDelete({ idPublication }).where({
      idUser: ctx.user.id,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.isLike = async (_, { idPublication }, ctx) => {
  try {
    const verifyLike = await Like.findOne({ idPublication }).where({
      idUser: ctx.user.id,
    });
    if (!verifyLike) throw new Error("No a dado like")
    return true;
  } catch (error) {
    return false;
  }
};

exports.countLikes = async(_,{idPublication}) => {
    try {
        const likes = await Like.countDocuments({idPublication})
        return likes
    } catch (error) {
        return null
    }
}
