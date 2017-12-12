"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = `
    extend type Query {
        accounts: [Account]!
    }

    type Account {
        id: ID!
        type: String!
        balance: Float!
    }
`;
exports.resolvers = {
    Query: {
        accounts: () => [{ id: 10001, balance: 1500, type: 'Personal' }, { id: 1, balance: 2300, type: 'Organization' }]
    },
};
