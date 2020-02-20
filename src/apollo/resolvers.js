import {
  RoleAmount,
  RolesFromClient,
  RolesFromServer,
  RoleDetailFromServer
} from "@/gql/role.gql";
import {
  LocalGroups,
  WorkingGroups,
  SelectedLocalGroups,
  SelectedWorkingGroups
} from "@/gql/group.gql";
import { SelectedTimeCommitment, Filter } from "@/gql/server.gql";
import gql from "graphql-tag";

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
    query: Filter
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

  // console.log("[ROLE]", data);
  const roles = data.data.role.map(r => ({
    ...r,
    time_commitment_min: r.time_commitment_min || 0,
    time_commitment_max: r.time_commitment_max || 40
  }));

  client.writeQuery({
    query: RolesFromClient,
    data: { roles }
  });

  cache.writeQuery({
    query: RoleAmount,
    data: { roleAmount: roles.length }
  });

  return roles;
};

const roleDetail = async (_, { id }, { cache, client }) => {
  const data = await client.query({
    query: RoleDetailFromServer,
    variables: { id }
  });
  const details = data.data.role[0];
  const roles = cache.readQuery({
    query: RolesFromClient
  });

  const role = roles.roles.filter(r => r.id === parseInt(id, 10))[0];
  // console.log(role, details);
  return {
    ...role,
    ...details
  };
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

export const resolvers = {
  Mutation: {
    updateLocalGroups,
    updateWorkingGroups,
    updateTimeCommitmentRange
  },

  Query: {
    roleDetail
  }

  // role: () => {
  //   return {
  //     id: 666,
  //     name: "",
  //     location: ""
  //   };
  // }
};
