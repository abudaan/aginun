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
  console.log("[mutation] updateRoleFilter", filter);
  // cache.writeFragment({
  //   fragment: gql`
  //     fragment update on RoleData {
  //       filter
  //     }
  //   `,
  //   data: filter,
  //   id: "RoleData:filter",
  // });
  client.writeQuery({
    query: GetFilter,
    data: {
      roleData: {
        id: "data",
        __typename: "RoleData",
        filter: {
          id: "filter",
          __typename: "Filter",
          ...filter,
        },
      },
    },
  });

  // console.log(cache.data.data["local_group:21"]);
  // const fragment = gql`
  //   fragment test on local_group {
  //     id
  //     name
  //   }
  // `;

  // await filtered(parent, {}, { cache, client });
  return filter;
};
