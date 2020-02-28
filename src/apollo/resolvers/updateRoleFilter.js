import { GetFilter } from "../gql/role.gql";
import { getGroupIds } from "./group";
// import gql from "graphql-tag";

export const updateRoleFilter = (
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
    if (localGroups.length) {
      filter.selectedLocalGroupIds = getGroupIds(
        "local_group",
        localGroups,
        cache
      );
    } else {
      filter.selectedLocalGroupIds = null;
    }
  }
  if (workingGroups) {
    if (workingGroups.length) {
      filter.selectedWorkingGroupIds = getGroupIds(
        "working_group",
        workingGroups,
        cache
      );
    } else {
      filter.selectedWorkingGroupIds = null;
    }
  }
  if (timeCommitment) {
    filter.selectedTimeCommitmentMin = timeCommitment[0];
    filter.selectedTimeCommitmentMax = timeCommitment[1];
  }
  if (searchString) {
    filter.searchString = `%${searchString}%`;
  }

  filter.id = "filter";
  filter.__typename = "Filter";

  client.writeQuery({
    query: GetFilter,
    data: {
      roleData: {
        id: "data",
        __typename: "RoleData",
        filter: {
          ...filter,
        },
      },
    },
  });

  // console.log("[mutation] updateRoleFilter", filter);
  return filter;
};
