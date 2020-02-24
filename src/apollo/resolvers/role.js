import {
  Filter,
  SearchString,
  SelectedLocalGroups,
  SelectedWorkingGroups,
  RoleServer,
  RoleServerWithFilter,
  UpdateFilter,
  FilteredRoles,
  RoleAmount,
  RoleDetailServer,
  RoleAllInfoServer,
  SelectedTimeCommitment,
  AggregateTimeCommitmentRangeServer,
  UpdateTimeCommitmentRange,
} from "../gql/role.gql";

const role = async (parent, variables, { cache, client }, info) => {
  const {
    RoleData: { filter },
  } = cache.readQuery({
    query: Filter,
  });
  // const filtered = await getRoles(cache, client);
  console.log("role @client", parent, variables, filter);
  return {
    __typename: "RoleData",
    // filtered: [{ id: 1, name: "Coder" }],
    // filter,
    // filtered: null,
  };
};

const filtered = async (...[, , { cache, client }]) => {
  console.log("FILTERED");
  const {
    roleData: { filter },
  } = cache.readQuery({
    query: Filter,
  });

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

  cache.writeQuery({
    query: RoleAmount,
    data: {
      roleData: {
        __typename: "RoleData",
        amount: roles.length,
      },
    },
  });

  return roles;
};

const getRoles = async (cache, client) => {
  const {
    roleData: { filter },
  } = cache.readQuery({
    query: Filter,
  });

  // console.log(filter);
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

  client.writeQuery({
    query: FilteredRoles,
    data: {
      // roleClient: {
      //   __typename: "RoleData",
      filtered: roles,
      // amount: roles.length,
      // },
    },
  });
  console.log(1, roles);
  return roles;
};

const roleDetail = async (_, { id }, { cache, client }) => {
  const roles = cache.readQuery({
    query: FilteredRoles,
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
    query: FilteredRoles,
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
    data: {
      roleData: {
        __typename: "RoleData",
        range,
      },
    },
  });

  return range;
};

const updateTimeCommitmentRange = (...[, { range }, { cache, client }]) => {
  const {
    roleData: { filter },
  } = cache.readQuery({
    query: Filter,
  });

  const f = {
    ...filter,
    selectedTimeCommitment: [range[0], range[1]],
  };

  console.log("updateTimeCommitmentRange");
  client.writeQuery({
    // query: UpdateFilter,
    query: UpdateTimeCommitmentRange,
    data: {
      roleData: {
        __typename: "RoleData",
        filter: {
          __typename: "Filter",
          selectedTimeCommitment: [range[0], range[1]],
        },
      },
    },
  });
  // getRoles(cache, client);
  // console.log(cache.data.data.ROOT_QUERY.selectedTimeCommitment);
  // return range;
  // filtered({}, null, { cache, client });
  return range;
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
  filtered,
  roleDetail,
  timeCommitmentRange,
  updateTimeCommitmentRange,
  updateSearchString,
  clearFilter,
};

export { roleResolvers, getRoles, role };

// const role = (parent, variables, { cache, client }) => {
//   console.log(parent, variables);
// };
