import { GraphQLServer, PubSub } from 'graphql-yoga';
import { merge } from 'lodash';

import * as accounts from './modules/accounts';
import * as customers from './modules/customers';
import * as loans from './modules/loans';

const modules = [accounts, customers, loans];

const rootTypeDefs = `
type Query {
}
`;

const typeDefs = rootTypeDefs + modules.map(x => x.typeDefs).join();
const resolvers = modules.map(x => x.resolvers).reduce(merge);

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))
