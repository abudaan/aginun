import { GetFilter } from "../gql/role.gql";
import gql from "graphql-tag";

export const updateRoleFilter = async (
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
    filter.selectedLocalGroupIds = localGroups;
  }
  if (workingGroups) {
    filter.selectedWorkingGroupIds = workingGroups;
  }
  if (timeCommitment) {
    filter.selectedTimeCommitmentMin = timeCommitment[0];
    filter.selectedTimeCommitmentMax = timeCommitment[1];
  }
  if (searchString) {
    filter.searchString = `%${searchString}%`;
  }
  // cache.writeFragment({
  //   fragment: gql`
  //     fragment update on RoleData {
  //       filter
  //     }
  //   `,
  //   data: filter,
  //   id: "RoleData:filter",
  // });

  filter.id = "filter";
  filter.__typename = "Filter";

  cache.writeQuery({
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

  const d = cache.readQuery({
    query: GetFilter,
  });
  console.log("retrieved", d);

  // await filtered(parent, {}, { cache, client });
  console.log("[mutation] updateRoleFilter", filter);
  return filter;
};