import {
  Filter,
  SearchString,
  SelectedLocalGroups,
  SelectedWorkingGroups,
  FilteredRoles,
  RoleDetailServer,
  RoleAllInfoServer,
  SelectedTimeCommitment,
  GetRoleData,
} from "../gql/role.gql";
import gql from "graphql-tag";

const getRoleData = async (parent, variables, { cache, client }, info) => {
  console.log("[query] getRoleData");
  const data = await client.readQuery({
    query: GetRoleData,
  });
  console.log("getRoleData", variables, data);
  return data.roleData;
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

// const updateTimeCommitmentRole = (_, { timeCommitment }, { cache, client }) => {
//   const {
//     roleData: { filter },
//   } = cache.readQuery({
//     query: GetFilter,
//   });

//   client.writeQuery({
//     query: GetFilter,
//     data: {
//       roleData: {
//         __typename: "RoleData",
//         filter: {
//           id: "filter",
//           __typename: "Filter",
//           ...filter,
//           selectedTimeCommitment: [timeCommitment[0], timeCommitment[1]],
//         },
//       },
//     },
//   });
// };

const clearRoleFilter = (...[, , { cache, client }]) => {
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
    data: { selectedLocalGroupIds: null },
  });

  client.writeQuery({
    query: SelectedWorkingGroups,
    data: { selectedWorkingGroupIds: null },
  });

  // getRoles(cache, client);
};

export { getRoleData, clearRoleFilter };

// const role = (parent, variables, { cache, client }) => {
//   console.log(parent, variables);
// };
