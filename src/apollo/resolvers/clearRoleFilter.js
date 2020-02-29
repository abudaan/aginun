import { GetFilter } from "../gql/role.gql";

export const clearRoleFilter = (...[, , { client }]) => {
  const filter = {
    id: "filter",
    __typename: "Filter",
    limit: 10,
    searchString: null,
    selectedLocalGroupIds: null,
    selectedWorkingGroupIds: null,
    selectedTimeCommitmentMin: 0,
    selectedTimeCommitmentMax: 40,
  };

  client.writeQuery({
    query: GetFilter,
    data: {
      roleData: {
        id: "data",
        __typename: "RoleData",
        filter,
      },
    },
  });

  // delete filter.id;
  // delete filter.__typename;

  return filter;
};
