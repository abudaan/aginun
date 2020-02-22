import {
  RoleAmount,
  RolesFromClient,
  RolesFromServer,
  RoleDetailFromServer,
  RoleAllInfoFromServer,
  LocalGroups,
  WorkingGroups,
  SelectedLocalGroups,
  SelectedWorkingGroups,
  SelectedTimeCommitment,
  Filter,
  SearchString,
  AggregateTimeCommitmentRange
} from "@/gql/queries.gql";

// util function that maps the names of the groups in the dropdown boxes in the drawer
// to their corresponding ids in the database
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

  // get the roles that match the current filter from the server
  const {
    data: { role: roles }
  } = await client.query({
    query: RolesFromServer,
    variables: {
      limit: filters.limit,
      search: filters.searchString ? `%${filters.searchString}%` : null,
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

const clearFilter = (_, __, { cache, client }) => {
  // const r = cache.readQuery();
  client.writeQuery({
    query: SelectedTimeCommitment,
    data: { selectedTimeCommitment: [0, 40] } // @todo: fix this!
  });

  client.writeQuery({
    query: SearchString,
    data: { searchString: "" }
  });

  client.writeQuery({
    query: SelectedLocalGroups,
    data: { selectedLocalGroups: [] }
  });

  client.writeQuery({
    query: SelectedWorkingGroups,
    data: { selectedWorkingGroups: [] }
  });

  getRoles(cache, client);
};

const aggregateTimeCommitmentRange = (_, __, { cache, client }) => {
  // AggregateTimeCommitmentRange
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
