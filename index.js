const { ApolloServer, makeRemoteExecutableSchema, introspectSchema } = require('apollo-server');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { mergeRemoteSchemas } = require('merge-remote-graphql-schemas');

async function createRemoteExecutableSchema(uri) {
  
  const httpLink = new HttpLink({
    uri,
    fetch,
  });

  console.log("here")
  const schema = makeRemoteExecutableSchema({
    schema: await introspectSchema(httpLink),
    httpLink,
  });

  console.log("here1")
  return schema;
};

Promise.all(['http://localhost:8000/products', 'http://localhost:9000/contacts'].map(createRemoteExecutableSchema))
  .then((schemas) => {
   console.log("schemas", schemas)
    const server = new ApolloServer({ schema: mergeRemoteSchemas({ schemas }) }); // Merge the remote schemas together and pass the result to ApolloServer

    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  });