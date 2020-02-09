import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag';

const httpLink = createHttpLink({
  uri: 'https://xr-volunteer-app.herokuapp.com/v1/graphql',
})

const cache = new InMemoryCache()

const typeDefs = gql`
  type FilterSettings {
    localGroupNames: [String]
    workingGroupNames: [String]
  },
  type Mutation {
    updateLocalGroupNames(names:[String!]):[String!]
    updateWorkingGroupNames(names:[String!]):[String!]
  }
`

cache.writeData({
  data: {
    localGroupNames: [],
    workingGroupNames: [],
    localGroupIds: [],
    workingGroupIds: [],
  },
});

const localGroupNamesQuery = gql`
  query lgq {
    localGroupNames @client 
  }
`
const workingGroupNamesQuery = gql`
  query wgq {
    workingGroupNames @client 
  }
`
const resolvers = {
  Mutation: {
    updateLocalGroupNames: (_, { value }, { cache }) => {
      // const data = cache.readQuery({
      //   query: localGroupNamesQuery,
      // });
      cache.writeQuery({
        query: localGroupNamesQuery,
        data: { localGroupNames: value }
      })
      // console.log(cache.data.data.ROOT_QUERY.localGroupNames);
      return true;
    },
    updateWorkingGroupNames: (_, { value }, { cache }) => {
      cache.writeQuery({
        query: workingGroupNamesQuery,
        data: { workingGroupNames: value }
      })
      // console.log(cache.data.data.ROOT_QUERY.workingGroupNames);
      return true;
    }
  }
}


export const apolloClient = new ApolloClient({
  cache,
  link: httpLink,
  typeDefs,
  resolvers,
})
