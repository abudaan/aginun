import {
  RoleAmount,
  RolesFromClient,
  RolesFromServer,
  RoleDetailFromServer,
  RoleAllInfoFromServer
} from "@/gql/role.gql";
import {
  LocalGroups,
  WorkingGroups,
  SelectedLocalGroups,
  SelectedWorkingGroups
} from "@/gql/group.gql";
import { SelectedTimeCommitment, Filter, SearchString } from "@/gql/filter.gql";
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
        ? filters.selectedLocalGroups.map(g => g.id)
        : null,
      workingGroupIds: filters.selectedWorkingGroups.length
        ? filters.selectedWorkingGroups.map(g => g.id)
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
  const roles = cache.readQuery({
    query: RolesFromClient
  });

  let role = roles.roles.filter(r => r.id === parseInt(id, 10))[0];

  if (role) {
    const data = await client.query({
      query: RoleDetailFromServer,
      variables: { id }
    });
    const details = data.data.role[0];
    return {
      ...role,
      ...details
    };
  }

  const data = await client.query({
    query: RoleAllInfoFromServer,
    variables: { id }
  });

  role = data.data.role[0];

  client.writeQuery({
    query: RolesFromClient,
    data: { roles: [role] }
  });

  return role;
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

const updateSearchString = (_, { search }, { cache, client }) => {
  client.writeQuery({
    query: SearchString,
    data: { searchString: search }
  });
  getRoles(cache, client);
  return null;
};

const clearFilter = (_, variables, { cache, client }) => {
  const r = cache.readQuery();
  client.writeQuery({
    query: SelectedTimeCommitment,
    data: { selectedTimeCommitment: r }
  });
};

export const resolvers = {
  Mutation: {
    updateLocalGroups,
    updateWorkingGroups,
    updateTimeCommitmentRange,
    updateSearchString,
    clearFilter
  },

  Query: {
    roleDetail
  }

  // role: () => {
  //   return {
  //     id: 10,
  //     name: "Composer",
  //     location: "Groningen"
  //   };
  // }
};
