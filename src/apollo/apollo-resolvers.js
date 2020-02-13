import { localGroupNames, workingGroupNames } from "../gql/queries_local.gql";

export const resolvers = {
  Mutation: {
    updateLocalGroupNames: (_, { value }, { cache }) => {
      // const data = cache.readQuery({
      //   query: localGroupNames,
      // });
      cache.writeQuery({
        query: localGroupNames,
        data: { localGroupNames: value }
      })
      console.log(cache.data.data.ROOT_QUERY.localGroupNames);
      return true;
    },
    updateWorkingGroupNames: (_, { value }, { cache }) => {
      cache.writeQuery({
        query: workingGroupNames,
        data: { workingGroupNames: value }
      })
      console.log(cache.data.data.ROOT_QUERY.workingGroupNames);
      return true;
    },
    // updateAmountRoles: (_, { value }, { cache }) => {
    //   cache.writeQuery({
    //     query: amountRoles,
    //     data: { amountRoles: value }
    //   })
    //   console.log(cache.data.data.ROOT_QUERY);
    //   return true;
    // }
  }
}
