import { GraphQLServer, PubSub } from 'graphql-yoga';
import { introspectSchema, mergeSchemas, makeRemoteExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

import * as scalars from './core/scalars';
import * as accounts from './modules/accounts';
import * as customers from './modules/customers';
import * as loans from './modules/loans';


const modules = [scalars]; //, accounts, customers, loans];

const rootTypeDefs = `
type Query {
    hello: JSON
}
`;

const typeDefs = rootTypeDefs + modules.map(x => x.typeDefs).join();
const resolvers = modules.map(x => x.resolvers).reduce(merge);



async function run() {
    const mainSchema = await getRemoteSchema('https://protected-shore-54986.herokuapp.com/');
    const jokSchema = await getRemoteSchema('http://graph.jok.io/graphql');
    const someLocalSchema = await getRemoteSchema('http://localhost:3000/graphql');

    const mergedSchemas = mergeSchemas({
        schemas: [mainSchema, jokSchema, typeDefs],
        resolvers: resolvers
    })

    const server = new GraphQLServer({ schema: mergedSchemas })
    server.start(() => console.log('Server is running on localhost:4000'))
}


async function getRemoteSchema(uri) {
    const link = new HttpLink({ uri, fetch })
    const introspectionSchema = await introspectSchema(link);
    const graphcoolSchema = makeRemoteExecutableSchema({
        schema: introspectionSchema,
        link
    });

    return graphcoolSchema;
}


run().then(x => {
    console.log('started')
});