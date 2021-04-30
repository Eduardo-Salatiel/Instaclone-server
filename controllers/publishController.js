const Publication = require("./../models/publication");
const Follow = require("./../models/follow");
const User = require("./../models/user");
const awsUploadImage = require("./../utils/aws-upload-image");
const { v4: uuidv4 } = require("uuid");

exports.publish = async (_, { file }, ctx) => {
  const { id } = ctx.user;
  const { createReadStream, mimetype } = await file;
  const extension = mimetype.split("/")[1];
  const filename = `publication/${uuidv4()}.${extension}`;
  const filedata = createReadStream();

  try {
    const result = await awsUploadImage(filedata, filename);
    const publication = new Publication({
      idUser: id,
      file: result,
      typeFile: mimetype.split("/")[0],
    });

    await publication.save();
    return {
      status: true,
      urlFile: result,
    };
  } catch (error) {
    return {
      status: null,
      urlFile: "",
    };
  }
};

exports.getPublications = async (_, { username }) => {
  const userFound = await User.findOne({ username });
  if (!userFound) throw new Error("Usuario no encontrado");
  try {
    const publications = await Publication.find({
      idUser: userFound._id,
    }).sort({ createdAt: -1 });

    return publications;
  } catch (error) {
    return null;
  }
};

exports.getPublicationsFollowers = async (_, {}, ctx) => {
  const followeds = await Follow.find({ idUser: ctx.user.id }).populate(
    "follow"
  );
  const followedsList = [];

  for await (const data of followeds) {
    followedsList.push(data.follow);
  }

  const publicationList = [];

  for await (const data of followedsList) {
    const publication = await Publication.find()
      .where({ idUser: data._id })
      .sort({ createdAt: -1 })
      .populate("idUser");
      publicationList.push(...publication)
  }

  const result = publicationList.sort((a,b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  });
  
  return result;
};
