
export const typeDefs = `
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


export const resolvers = {
    Query: {
        loans: () => [{ id: 1, amount: 100 }, { id: 1, amount: 450 }]
    },
    Account: {
        loanCount: () => new Promise(resolve => setTimeout(() => resolve(2), 1000))
    }
};
