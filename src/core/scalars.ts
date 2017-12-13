import GraphQLJSON from './scalars/json';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from './scalars/datetime';

export const typeDefs = `
scalar JSON
scalar Date
scalar Time
scalar DateTime
`;


export const resolvers = {
    JSON: GraphQLJSON,
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,
};
