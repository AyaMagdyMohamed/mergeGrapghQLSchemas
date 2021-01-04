const { ApolloServer, makeRemoteExecutableSchema, introspectSchema } = require('apollo-server');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { mergeRemoteSchemas } = require('merge-remote-graphql-schemas');
const { buildClientSchema } = require("graphql");
const { introspectionQuery } = require("graphql");
const fs = require("fs");
const {mergeSchemas} = require('graphql-tools');

function fetchRequest(uri){

return fetch(uri, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: introspectionQuery })
})
 
  }
async function createRemoteExecutableSchema(uri) {
  
  const httpLink = new HttpLink({
    uri,
    fetch,
  });

  const schema = makeRemoteExecutableSchema({
    schema: await introspectSchema(httpLink),
    httpLink,
  });

  return schema;
};

Promise.all(['http://localhost:3000/graphiql', 'http://localhost:4000/graphiql2'].map(createRemoteExecutableSchema))
  .then((schemas) => {
   console.log("schemas", schemas)
    const server = new ApolloServer({ schema: mergeSchemas({ schemas }) }); // Merge the remote schemas together and pass the result to ApolloServer

    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  });