
export const typeDefs = `
    extend type Query {
        accounts: [Account]!
    }

    type Account {
        id: ID!
        type: String!
        balance: Float!
    }
`;


export const resolvers = {
    Query: {
        accounts: () => [{ id: 10001, balance: 1500, type: 'Personal' }, { id: 1, balance: 2300, type: 'Organization' }]
    },

    Subscription: {
        counter: {
            subscribe: (parent, args, { pubsub }) => {
                const channel = Math.random().toString(36).substring(2, 15) // random channel name
                let count = 0
                setInterval(() => pubsub.publish(channel, { counter: (count++).toString() }), 2000)
                return pubsub.asyncIterator(channel)
            },
        }
    },

};