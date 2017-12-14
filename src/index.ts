import { GraphQLServer, PubSub } from 'graphql-yoga';
import { introspectSchema, mergeSchemas, makeRemoteExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { HttpLink } from 'apollo-link-http';
import { Engine } from 'apollo-engine';
import { graphiqlExpress } from 'apollo-server-express';

import fetch from 'node-fetch';

import * as scalars from './core/scalars';
import * as accounts from './modules/accounts';
import * as customers from './modules/customers';
import * as loans from './modules/loans';


const modules = [scalars, accounts, customers, loans];

const rootTypeDefs = `
    type Query {
        hello: String
    }

    type Subscription {
        counter: String
    }
`;

const typeDefs = rootTypeDefs + modules.map(x => x.typeDefs).join();
const resolvers = modules.map(x => x.resolvers).reduce(merge);

async function run() {
    // const mainSchema = await getRemoteSchema('https://protected-shore-54986.herokuapp.com/');
    // const jokSchema = await getRemoteSchema('http://graph.jok.io/graphql');

    const schema = mergeSchemas({
        schemas: [typeDefs],
        resolvers: resolvers
    });

    const pubsub = new PubSub();
    const context = {
        pubsub
    }

    const server = new GraphQLServer({
        schema, context, options: {
            tracing: true,
            disablePlayground: true
        }
    });

    const engine = new Engine({
        engineConfig: { apiKey: process.env.APOLLO_ENGINE_KEY || 'service:playerx-747:qh9bULYm5hNnMODRcw46Rw' },
        endpoint: '/',
        graphqlPort: parseInt(process.env.Port, 10) || 4000,
    })
    engine.start();

    server.express.get('/', graphiqlExpress({ endpointURL: '/', subscriptionsEndpoint: 'ws://localhost:4000/' }))
    server.express.use(engine.expressMiddleware());
    server.start(() => console.log('Server is running on localhost:4000'));
}


export async function getRemoteSchema(uri) {
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