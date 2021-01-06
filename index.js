const { ApolloServer, makeRemoteExecutableSchema, introspectSchema, introspectionQuery } = require('apollo-server');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { mergeRemoteSchemas } = require('merge-remote-graphql-schemas');


function fetchRequest(uri){

return fetch(uri, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: introspectionQuery })
})
 
  }
async function createRemoteExecutableSchema(uri) {
  
  console.log("uri", uri)
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

Promise.all(['http://localhost:5000/graphql2', 'http://localhost:3000/graphql'].map(createRemoteExecutableSchema))
  .then((schemas) => {
   console.log("schemas", schemas)
    const server = new ApolloServer({ schema: mergeRemoteSchemas({ schemas }) }); // Merge the remote schemas together and pass the result to ApolloServer

    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  });