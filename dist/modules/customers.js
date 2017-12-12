"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = `
    extend type Query {
        customers: [Customer]!
    }

    type Customer {
        id: ID!
        name: String!
        type: String
        accounts: [Account]!
    }
`;
exports.resolvers = {
    Query: {
        customers: () => [{ id: 1, name: 'Petre', type: 'Physical' }, { id: 1, name: 'Ezeki', type: 'Physical' }]
    },
    Customer: {
        accounts: () => []
    }
};
