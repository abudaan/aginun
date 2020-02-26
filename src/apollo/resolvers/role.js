import {
  Filter,
  SearchString,
  SelectedLocalGroups,
  SelectedWorkingGroups,
  FilteredRoles,
  GetRoleAmount,
  RoleDetailServer,
  RoleAllInfoServer,
  SelectedTimeCommitment,
  TimeCommitmentRangeRole,
  UpdateTimeCommitmentRangeRole,
  GetRoles,
  GetRoleData,
  GetFilteredRolesCache,
  GetSelectedLocalGroups,
  GetSelectedWorkingGroups,
  GetFilter,
} from "../gql/role.gql";
import gql from "graphql-tag";
import { updateLocalGroupsGeneric } from "./group";

const getRoleData = async (parent, variables, { cache, client }, info) => {
  console.log("[query] getRoleData");
  const data = await client.readQuery({
    query: GetRoleData,
  });
  // console.log("getRoleData", data);
  return data.roleData;
};

const filtered = async (parent, variables, { cache, client }, info) => {
  console.log("[field] filtered");
  const {
    data: { role: roles },
  } = await client.query({
    query: GetRoles,
  });

  cache.writeQuery({
    query: GetRoleAmount,
    data: {
      roleData: {
        __typename: "RoleData",
        amount: roles.length,
      },
    },
  });

  cache.writeQuery({
    query: GetFilteredRolesCache,
    data: {
      roleData: {
        __typename: "RoleData",
        filtered: {
          __typename: "FilteredRoles",
          roles,
        },
      },
    },
  });
  // const d = cache.readQuery({
  //   query: GetFilteredRolesCache,
  // });
  // console.log("retrieved", d);
  return {
    typename: "FilteredRoles",
    roles,
  };
};

const timeCommitmentRange = async (...[, , { cache, client }]) => {
  console.log("[field] timeCommitmentRange");
  const data = await client.query({
    query: TimeCommitmentRangeRole,
  });
  const range = {
    __typename: "Range",
    min: data.data.role_aggregate.aggregate.min.time_commitment_min,
    max: data.data.role_aggregate.aggregate.max.time_commitment_max,
  };
  // console.log(data);
  cache.writeQuery({
    query: UpdateTimeCommitmentRangeRole,
    data: {
      roleData: {
        __typename: "RoleData",
        range,
      },
    },
  });

  return range;
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

const updateRoleFilter = (
  parent,
  { localGroups, workingGroups, timeCommitment, searchString },
  { cache, client }
) => {
  const {
    roleData: { filter },
  } = cache.readQuery({
    query: GetFilter,
  });
  if (localGroups) {
    filter.selectedLocalGroups = localGroups;
  }
  if (workingGroups) {
    filter.selectedWorkingGroups = workingGroups;
  }
  if (timeCommitment) {
    filter.selectedTimeCommitmentMin = timeCommitment[0];
    filter.selectedTimeCommitmentMax = timeCommitment[1];
  }
  if (searchString) {
    filter.searchString = `%${searchString}%`;
  }
  // console.log("[mutation] updateRoleFilter", filter);
  client.writeQuery({
    query: GetFilter,
    data: {
      roleData: {
        __typename: "RoleData",
        filter: {
          __typename: "Filter",
          ...filter,
        },
      },
    },
  });
  return filter;
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
    query: UpdateTimeCommitmentRangeRole,
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

  // getRoles(cache, client);
};

const updateSearchString = (...[, { search }, { cache, client }]) => {
  client.writeQuery({
    query: SearchString,
    data: { searchString: search },
  });
  // getRoles(cache, client);
  return null;
};

const roleResolvers = {
  roleDetail,
  timeCommitmentRange,
  updateTimeCommitmentRange,
  updateSearchString,
  clearFilter,
};

export {
  roleResolvers,
  filtered,
  getRoleData,
  timeCommitmentRange,
  updateRoleFilter,
};

// const role = (parent, variables, { cache, client }) => {
//   console.log(parent, variables);
// };
