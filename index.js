const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });
const { ApolloServer } = require("apollo-server");
const resolver = require("./graphql/resolver");
const typeDefs = require("./graphql/schema");
const jwt = require("jsonwebtoken");

mongoose
  .connect(process.env.CONNECT_BD, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  .then(() => {
    server();
  })
  .catch((err) => {
    console.log(err.message);
  });

function server() {
  const serverApollo = new ApolloServer({
    typeDefs,
    resolvers: resolver,
    context: ({ req }) => {
      const token = req.headers.authorization;
      if (token) {
        try {
          const user = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.SEED
          );
          return {
            user,
          };
        } catch (error) {
          throw new Error("Token invalido");
        }
      }
    },
  });

  serverApollo.listen().then(({ url }) => {
    console.log(`Servidor levantado en: ${url}`);
  });
}
