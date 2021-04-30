const Follow = require("./../models/follow");
const User = require("./../models//user");

exports.follow = async (_, { username }, ctx) => {
  const userFound = await User.findOne({ username });
  if (!userFound) throw new Error("Usuario no encontrado");

  try {
    const follow = new Follow({
      idUser: ctx.user.id,
      follow: userFound._id,
    });
    await follow.save();
    return true;
  } catch (error) {
    return false;
  }
};

exports.isFollow = async (_, { username }, ctx) => {
  const userFound = await User.findOne({ username });
  if (!userFound) throw new Error("Usuario no encontrado");
  const follow = await Follow.find({ idUser: ctx.user.id })
    .where("follow")
    .equals(userFound._id);

  if (follow.length > 0) {
    return true;
  }
  return false;
};

exports.unFollow = async (_, { username }, ctx) => {
  const userFound = await User.findOne({ username });
  const follow = await Follow.deleteOne({ idUser: ctx.user.id })
    .where("follow")
    .equals(userFound._id);

  console.log(follow);
  if (follow.deletedCount > 0) {
    return true;
  } else {
    return false;
  }
};

exports.getFollowers = async (_, { username }, ctx) => {
  const userFound = await User.findOne({ username });
  const followers = await Follow.find({ follow: userFound._id }).populate(
    "idUser"
  );
  const followersList = [];

  for await (const data of followers) {
    followersList.push(data.idUser);
  }
  return followersList;
};

exports.getFolloweds = async (_, { username }) => {
  const userFound = await User.findOne({ username });
  const followeds = await Follow.find({ idUser: userFound._id }).populate(
    "follow"
  );
  const followedlist = [];

  for await (const data of followeds) {
    followedlist.push(data.follow);
  }

  return followedlist;
};

exports.getNotFolloweds = async (_, {}, ctx) => {
  const users = await User.find().limit(50);
  const arrUsers = [];

  for await (const data of users) {
    const isFind = await Follow.findOne({ idUser: ctx.user.id })
      .where("follow")
      .equals(data._id);
    if (!isFind) {
      if (ctx.user.id.toString() !== data._id.toString()) {
        arrUsers.push(data);
      }
    }
  }
  return arrUsers;
};
