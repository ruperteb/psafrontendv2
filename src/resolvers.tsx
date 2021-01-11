import { gql, ApolloCache, Resolvers } from '@apollo/client';


export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    
  }
`;

type ResolverFn = (
  parent: any,
  args: any,
  { cache } : { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
  // We will update this with our app's resolvers later
}

export const resolvers = {};