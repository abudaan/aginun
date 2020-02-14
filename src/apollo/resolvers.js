import gql from "graphql-tag";
import { selectedLocalGroups, selectedWorkingGroups } from "../gql/client.gql";
import { allLocalGroups, allWorkingGroups } from "../gql/server.gql";

const mapNames = (names, groups) => {
  const matched = names.map(name => {
    let group;
    for(let i = 0; i < groups.length; i++) {
      if(groups[i].name === name) {
        group = groups[i];
        break;
      }
    }
    return group;
  })
  return matched;
}

export const resolvers = {
  Mutation: {
    updateLocalGroups(_, { names }, { cache, getCacheKey, client }, info) {
      const {local_group: groups} = cache.readQuery({
        query: allLocalGroups
      });
      cache.writeQuery({
        query: selectedLocalGroups,
        data: { selectedLocalGroups: mapNames(names, groups) }
      })
      // console.log(cache.data.data.ROOT_QUERY.selectedLocalGroups);
    },
    updateWorkingGroups(_, { names }, { cache }) {
      const {working_group: groups} = cache.readQuery({
        query: allWorkingGroups
      });
      cache.writeQuery({
        query: selectedWorkingGroups,
        data: { selectedWorkingGroups: mapNames(names, groups) }
      })
      // console.log(cache.data.data.ROOT_QUERY.selectedWorkingGroups);
    },
    // updateAmountRoles: (_, { value }, { cache }) => {
    //   cache.writeQuery({
    //     query: amountRoles,
    //     data: { amountRoles: value }
    //   })
    //   console.log(cache.data.data.ROOT_QUERY);
    //   return true;
    // }
  },

  // Query: {
  //   getLocalGroups(_, data, data1, data2){
  //     console.log(_, data, data1, data2);
  //     return {
  //       id: 666,
  //       name: "XR Apeldoorn"
  //     }
  //   }
  // }
}
