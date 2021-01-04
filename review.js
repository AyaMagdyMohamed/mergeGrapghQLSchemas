const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { graphqlHTTP } = require('express-graphql');
// Some fake data
const reviews = [
  {
    title: "Harry Potter",
    id : 'review1'
  },
  {
    title: 'Aya',
    id : 'review2'
  },
];

// The GraphQL schema in string form
const typeDefs = `
type Query {
    
    review(id: ID!): Review
    reviews :  [Review]
  }
  
  type Review {
    id: ID!
    title: String!
   
  }
`;

// The resolvers
const resolvers = {
  Query: { reviews: () => reviews },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
//app.use('/graphql2', graphqlExpress({ schema }));


app.use('/graphql2', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
}))

// GraphiQL, a visual editor for queries
//app.use('/graphiql2', graphiqlExpress({ endpointURL: '/graphql2' }));

// Start the server
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql2 to run queries!');
});