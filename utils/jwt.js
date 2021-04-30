const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
  return new Promise((resolve, reject) => {
    const { id, name, email, username } = user;
    const payload = { id, name, email, username };

    jwt.sign(
      payload,
      process.env.SEED,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports ={
    generateJWT
}
