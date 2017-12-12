"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_yoga_1 = require("graphql-yoga");
const lodash_1 = require("lodash");
const accounts = require("./modules/accounts");
const customers = require("./modules/customers");
const loans = require("./modules/loans");
const modules = [accounts, customers, loans];
const rootTypeDefs = `
type Query {
    hello: String
}
`;
const typeDefs = rootTypeDefs + modules.map(x => x.typeDefs).join();
const resolvers = modules.map(x => x.resolvers).reduce(lodash_1.merge);
const server = new graphql_yoga_1.GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
// const typeDefs = `
//   type Query {
//   }
//   type Subscription {
//   }
//   type User {
//       id: ID!
//       name: String!
//       accounts: [Account]!
//   }
//   type Account {
//       id: ID!
//       type: String!
//       balance: Float!
//   }
// `
// const resolvers = {
//   Query: {
//     hello: () => `Hello`,
//     users: () => [{ id: 1, name: 'ezeki', accounts: [] }, { id: 2, name: 'playerx', accounts: [] }]
//   },
//   User: {
//     accounts: () => [{ id: 1001, type: 'personal', balance: 110 }, { id: 1002, type: 'organization', balance: 0 }]
//   },
//   Counter: {
//     countStr: counter => `Current count: ${counter.count}`,
//   },
//   Subscription: {
//     counter: {
//       subscribe: (parent, args, { pubsub }) => {
//         const channel = Math.random().toString(36).substring(2, 15) // random channel name
//         let count = 0
//         setInterval(() => pubsub.publish(channel, { counter: { count: count++ } }), 2000)
//         return pubsub.asyncIterator(channel)
//       },
//     }
//   },
// }
// const pubsub = new PubSub()
// const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })
// server.start(() => console.log('Server is running on localhost:4000'))
