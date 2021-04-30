const User = require("./../models/user");
const { generateJWT } = require("./../utils/jwt");
const bcrypt = require("bcryptjs");
const awsUploadImage = require("../utils/aws-upload-image");

exports.register = async (_, { input }) => {
  const newUser = input;
  newUser.username = newUser.username.toLowerCase();
  const { email, username, password } = newUser;

  const foundEmail = await User.findOne({ email });
  if (foundEmail) throw new Error("El correo ya existe");

  const foundUsername = await User.findOne({ username });
  if (foundUsername) throw new Error("El username no esta disponible");

  newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  try {
    const user = new User(newUser);
    await user.save();
    return user;
  } catch (error) {
    console.log(error.message);
  }
};

exports.login = async (_, { input }) => {
  const { email, password } = input;
  const userFound = await User.findOne({ email });
  if (!userFound) throw new Error("correo o contraseña incorrectos");
  const passwordSucess = bcrypt.compareSync(password, userFound.password);
  if (!passwordSucess) throw new Error("correo o contraseña incorrectos");

  const token = await generateJWT(userFound);

  return {
    token,
  };
};

exports.getUser = async (_, { id, username }) => {
  let user = null;
  if (id) user = await User.findById(id);
  if (username) user = await User.findOne({ username });
  if (!user) throw new Error("El usuario no existe");

  return user;
};

exports.updateAvatar = async (_, { file }, ctx) => {
  const { id } = ctx.user;
  const { mimetype, createReadStream } = await file;

  const extension = mimetype.split("/")[1];
  const imageName = `avatar/${id}.${extension}`;
  const fileData = createReadStream();

  try {
    const result = await awsUploadImage(fileData, imageName);
    await User.findByIdAndUpdate(id, { avatar: result });
    return {
      status: true,
      urlAvatar: result,
    };
  } catch (error) {
    return {
      status: false,
      urlAvatar: null,
    };
  }
};

exports.deleteAvatar = async (_, {}, ctx) => {
  const { id } = ctx;
  try {
    await User.findByIdAndUpdate(id, { avatar: "" });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.updateUser = async (_, { input }, ctx) => {
  console.log(ctx.user.id);

  try {
    if (input.currentPassword && input.newPassword) {
      const userFound = await User.findById(ctx.user.id);
      console.log(userFound);
      const validatePassword = await bcrypt.compareSync(
        input.currentPassword,
        userFound.password
      );
      if (!validatePassword) throw new Error("Contraseña incorrecta");
      const newPasswordCrypt = await bcrypt.hashSync(
        input.newPassword,
        bcrypt.genSaltSync(10)
      );
      await User.findByIdAndUpdate(ctx.user.id, { password: newPasswordCrypt });
    } else {
      await User.findByIdAndUpdate(ctx.user.id, input);
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.search = async(_,{search}) => {
  try {
    const users = await User.find({name: {$regex: search, $options: "i"}})
    return users;
  } catch (error) {
    return{
      error: "No se encontraron resultados"
    }
  }

}
