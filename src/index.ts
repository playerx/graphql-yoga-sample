import { GraphQLServer, PubSub } from 'graphql-yoga';
import { introspectSchema, mergeSchemas, makeRemoteExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

import * as accounts from './modules/accounts';
import * as customers from './modules/customers';
import * as loans from './modules/loans';


const modules = [accounts, customers, loans];

const rootTypeDefs = `
extend type Query {
    newQuery: [String]!
    account(id: ID): Account
}
extend type Account {
    rating: Float!
    musicChannels(filter: String): [Channel]
}
`;

const resolvers = {
    Query: {
        newQuery: () => ['1', '2', '3'],
        account: (obj, { id }) => ({})
    },
    Account: {
        rating: () => Math.random(),
        musicChannels: (obj, { filter }, context, info) => [
            {
                "id": 2,
                "name": "HITS" + obj.id + ' ' + filter
            },
            {
                "id": 10,
                "name": "NOSTALGIA"
            },
            {
                "id": 24,
                "name": "Bossa Nova"
            },
            {
                "id": 25,
                "name": "Chiptunes"
            },
            {
                "id": 29,
                "name": "Classic Rap"
            }
        ]
    }
}


const typeDefs = rootTypeDefs  //+ modules.map(x => x.typeDefs).join();
// const resolvers = modules.map(x => x.resolvers).reduce(merge);



async function run() {
    const mainSchema = await getRemoteSchema('https://protected-shore-54986.herokuapp.com/');
    const jokSchema = await getRemoteSchema('http://graph.jok.io/graphql');

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