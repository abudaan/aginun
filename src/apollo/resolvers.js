import {
  SelectedLocalGroups,
  SelectedWorkingGroups,
  SelectedTimeCommitment,
  LocalGroupById,
  RoleAmount,
  UpdateRoles
} from "../gql/client.gql";
import { LocalGroups, WorkingGroups, Roles } from "../gql/server.gql";
import gql from "graphql-tag";
import uniqid from "uniqid";

const mapNames = (names, groups) => {
  const matched = names.map(name => {
    let group;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].name === name) {
        group = groups[i];
        break;
      }
    }
    return group;
  });
  return matched;
};

const testLocalQuery = async (_, { client, getCacheKey }) => {
  const data = await client.query({
    query: LocalGroupById,
    variables: { id: 1 }
  });
  console.log(data);
};

const updateLocalGroups = (_, { names }, { cache }) => {
  const { local_group: groups } = cache.readQuery({
    query: LocalGroups
  });
  cache.writeQuery({
    query: SelectedLocalGroups,
    data: { selectedLocalGroups: mapNames(names, groups) }
  });
  // console.log(cache.data.data.ROOT_QUERY.selectedLocalGroups);
  return null;
};

const updateWorkingGroups = (_, { names }, { cache }) => {
  const { working_group: groups } = cache.readQuery({
    query: WorkingGroups
  });
  cache.writeQuery({
    query: SelectedWorkingGroups,
    data: { selectedWorkingGroups: mapNames(names, groups) }
  });
  // console.log(cache.data.data.ROOT_QUERY.selectedWorkingGroups);
  return null;
};

const updateTimeCommitmentRange = (_, { range }, { cache }) => {
  cache.writeQuery({
    query: SelectedTimeCommitment,
    data: { selectedTimeCommitment: range }
  });
  // console.log(cache.data.data.ROOT_QUERY.selectedTimeCommitment);
  return null;
};

const updateRoleAmount = (_, { amount }, { cache }) => {
  cache.writeQuery({
    query: RoleAmount,
    data: { roleAmount: amount }
  });
  // console.log(cache.data.data.ROOT_QUERY.roleAmount);
  return null;
};

const updateRoles = (_, { roles }, { cache }) => {
  console.log(roles);
};

const role = async (parent, variables, { cache }) => {
  console.log("ROLE");
  return null;
};

export const resolvers = {
  Mutation: {
    updateLocalGroups,
    updateWorkingGroups,
    updateTimeCommitmentRange,
    updateRoleAmount,
    updateRoles
  },

  Query: {
    role: async (parent, variables, { client, cache }) => {
      // console.log(parent, variables);
      const data = await client.query({
        query: Roles,
        variables
      });

      // console.log(data.data.role);
      const roles = data.data.role.map(r => {
        return {
          __typename: "role",
          id: r.id,
          name: r.name,
          location: r.location,
          localGroup: r.local_group.name,
          workingGroup: r.working_group.name,
          timeCommitmentMin: r.time_commitment_min[0],
          timeCommitmentMax: r.time_commitment_max[1]
        };
      });

      // cache.writeQuery({
      //   query: UpdateRoles,
      //   data: { roles }
      // });
      console.log(cache);
      // const amountRoles = role.length;
      console.log("PARSED ROLES", roles);
      return roles;
    }
  }
  // role: () => {
  //   return {
  //     id: 666,
  //     name: "",
  //     location: ""
  //   };
  // }
};
