import {
  Filter,
  SearchString,
  SelectedLocalGroups,
  SelectedWorkingGroups,
  RoleServer,
  RoleClient,
  RoleAmount,
  RoleDetailServer,
  RoleAllInfoServer,
  SelectedTimeCommitment,
  AggregateTimeCommitmentRangeServer,
  UpdateTimeCommitmentRange,
} from "../gql/role.gql";

const roleClient = (parent, variables, { cache, client }, info) => {
  // console.log("roleClient", parent, variables, { cache, client }, info);
  // const roles = cache.readQuery({ query: RoleClient });
  // console.log(roles);
  // return roles;
  // return {
  //   __typename: "RoleClient",
  //   // updateTimeCommitmentRange: [13, 16],
  // };
  return getRoles(cache, client);
};

const getRoles = async (cache, client) => {
  const {
    roleClient: { filter },
  } = cache.readQuery({
    query: Filter,
  });
  console.log("FILTERS", filter);

  // get the roles that match the current filter from the server
  const {
    data: { role: roles },
  } = await client.query({
    query: RoleServer,
    variables: {
      limit: filter.limit,
      search: filter.searchString ? `%${filter.searchString}%` : null,
      localGroupIds: filter.selectedLocalGroups.length
        ? filter.selectedLocalGroups.map(g => g.id)
        : null,
      workingGroupIds: filter.selectedWorkingGroups.length
        ? filter.selectedWorkingGroups.map(g => g.id)
        : null,
      timeCommitmentMin: filter.selectedTimeCommitment[0],
      timeCommitmentMax: filter.selectedTimeCommitment[1],
    },
  });

  console.log("DATA", roles);

  client.writeQuery({
    query: RoleClient,
    data: { roles },
  });

  cache.writeQuery({
    query: RoleAmount,
    data: { roleAmount: roles.length },
  });

  return roles;
};

const roleDetail = async (_, { id }, { cache, client }) => {
  const roles = cache.readQuery({
    query: RoleClient,
  });

  let role = roles.roles.filter(r => r.id === parseInt(id, 10))[0];

  if (role) {
    const data = await client.query({
      query: RoleDetailServer,
      variables: { id },
    });
    const details = data.data.role[0];
    return {
      ...role,
      ...details,
    };
  }

  const data = await client.query({
    query: RoleAllInfoServer,
    variables: { id },
  });

  role = data.data.role[0];

  client.writeQuery({
    query: RoleClient,
    data: { roles: [role] },
  });

  return role;
};

const timeCommitmentRange = async (...[, , { cache, client }]) => {
  const data = await client.query({
    query: AggregateTimeCommitmentRangeServer,
  });
  const range = {
    __typename: "Range",
    min: data.data.role_aggregate.aggregate.min.time_commitment_min,
    max: data.data.role_aggregate.aggregate.max.time_commitment_max,
  };

  cache.writeQuery({
    query: UpdateTimeCommitmentRange,
    data: { range },
  });

  return range;
};

const updateTimeCommitmentRange = (...[, { range }, { cache, client }]) => {
  console.log("updateTimeCommitmentRange");
  cache.writeQuery({
    query: SelectedTimeCommitment,
    data: { selectedTimeCommitment: range },
  });
  getRoles(cache, client);
  // console.log(cache.data.data.ROOT_QUERY.selectedTimeCommitment);
  return null;
};

const clearFilter = (...[, , { cache, client }]) => {
  // const r = cache.readQuery();
  client.writeQuery({
    query: SelectedTimeCommitment,
    data: { selectedTimeCommitment: [0, 40] }, // @todo: fix this!
  });

  client.writeQuery({
    query: SearchString,
    data: { searchString: "" },
  });

  client.writeQuery({
    query: SelectedLocalGroups,
    data: { selectedLocalGroups: [] },
  });

  client.writeQuery({
    query: SelectedWorkingGroups,
    data: { selectedWorkingGroups: [] },
  });

  getRoles(cache, client);
};

const updateSearchString = (...[, { search }, { cache, client }]) => {
  client.writeQuery({
    query: SearchString,
    data: { searchString: search },
  });
  getRoles(cache, client);
  return null;
};

const roleResolvers = {
  roleDetail,
  timeCommitmentRange,
  updateTimeCommitmentRange,
  updateSearchString,
  clearFilter,
};

export { roleResolvers, getRoles, roleClient };

// const role = (parent, variables, { cache, client }) => {
//   console.log(parent, variables);
// };
