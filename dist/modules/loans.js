"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = `
    extend type Query {
        loans: [Loan]!
    }

    type Loan {
        id: ID!
        amount: Float!
    }

    extend type Account {
        loanCount: Int!
    }
`;
exports.resolvers = {
    Query: {
        loans: () => [{ id: 1, amount: 100 }, { id: 1, amount: 450 }]
    },
    Account: {
        loanCount: () => new Promise(resolve => setTimeout(() => resolve(2), 1000))
    }
};
