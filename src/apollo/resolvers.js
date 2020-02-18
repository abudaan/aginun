import {
  SelectedLocalGroups,
  SelectedWorkingGroups,
  SelectedTimeCommitment,
  LocalGroupById,
  RoleAmount,
  UpdateRoles,
  RolesFromClient,
  Filters
} from "../gql/client.gql";
import { LocalGroups, WorkingGroups, RolesFromServer } from "../gql/server.gql";
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

const getRoles = async (cache, client) => {
  const filters = cache.readQuery({
    query: Filters
  });

  const data = await client.query({
    query: RolesFromServer,
    variables: {
      limit: filters.limit,
      search: filters.searchString ? filters.searchString : null,
      localGroupIds: filters.selectedLocalGroups.length
        ? filters.selectedLocalGroups
        : null,
      workingGroupIds: filters.selectedWorkingGroups.length
        ? filters.selectedWorkingGroups
        : null,
      timeCommitmentMin: filters.selectedTimeCommitment[0],
      timeCommitmentMax: filters.selectedTimeCommitment[1]
    }
  });

  const roles = data.data.role.map(r => ({
    __typename: "role",
    id: r.id,
    name: r.name,
    location: r.location,
    localGroup: r.local_group.name,
    workingGroup: r.working_group.name,
    timeCommitmentMin: r.time_commitment_min[0] || 0,
    timeCommitmentMax: r.time_commitment_max[1] || 40
  }));

  console.log(roles);
  client.writeQuery({
    query: RolesFromClient,
    data: { roles }
  });

  console.log(cache);

  return roles;
};

const updateLocalGroups = (_, { names }, { cache, client }) => {
  const { local_group: groups } = cache.readQuery({
    query: LocalGroups
  });
  cache.writeQuery({
    query: SelectedLocalGroups,
    data: { selectedLocalGroups: mapNames(names, groups) }
  });
  // console.log(cache.data.data.ROOT_QUERY.selectedLocalGroups);
  getRoles(cache, client);
  return null;
};

const updateWorkingGroups = (_, { names }, { cache, client }) => {
  const { working_group: groups } = cache.readQuery({
    query: WorkingGroups
  });
  cache.writeQuery({
    query: SelectedWorkingGroups,
    data: { selectedWorkingGroups: mapNames(names, groups) }
  });
  getRoles(cache, client);
  // console.log(cache.data.data.ROOT_QUERY.selectedWorkingGroups);
  return null;
};

const updateTimeCommitmentRange = (_, { range }, { cache, client }) => {
  cache.writeQuery({
    query: SelectedTimeCommitment,
    data: { selectedTimeCommitment: range }
  });
  getRoles(cache, client);
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
  console.log("HUHUHU", roles);
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
    roles(parent, variables, { client, cache }) {
      const roles = cache.readQuery({
        query: RolesFromClient
      });
      console.log(roles);
      return roles;
    },
    role: async (parent, variables, { client, cache }) => {
      // console.log(parent, variables);
      // const data = await client.query({
      //   query: Roles,
      //   variables
      // });

      // // console.log(data.data.role);
      // const roles = data.data.role.map(r => {
      //   return {
      //     __typename: "role",
      //     id: r.id,
      //     name: r.name,
      //     location: r.location,
      //     localGroup: r.local_group.name,
      //     workingGroup: r.working_group.name,
      //     timeCommitmentMin: r.time_commitment_min[0],
      //     timeCommitmentMax: r.time_commitment_max[1]
      //   };
      // });

      // cache.writeQuery({
      //   query: UpdateRoles,
      //   data: { roles }
      // });
      // console.log(cache);
      // const amountRoles = role.length;
      // console.log("PARSED ROLES", roles);
      return [];
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
