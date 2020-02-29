import { GetFilter, GetRoleFilter } from "../gql/role.gql";

export const filter = async (...[, , { client }]) => {
  client
    .watchQuery({
      query: GetRoleFilter,
    })
    .subscribe(({ data, loading }) => {
      console.log("WATCH ME", data.searchString);
    });

  const {
    roleData: { filter },
  } = client.readQuery({
    query: GetFilter,
  });

  return {
    searchString: filter.searchString
      ? filter.searchString.replace(/%/g, "")
      : null,
    selectedTimeCommitment: [
      filter.selectedTimeCommitmentMin,
      filter.selectedTimeCommitmentMax,
    ],
    selectedLocalGroups: filter.selectedLocalGroups
      ? filter.selectedLocalGroups.map(({ name }) => name)
      : [],
    selectedWorkingGroups: filter.selectedWorkingGroups
      ? filter.selectedWorkingGroups.map(({ name }) => name)
      : [],
  };
};

export const filter2 = (...[, , { client }]) => {
  const {
    roleData: { filter },
  } = client.readQuery({
    query: GetFilter,
  });

  return {
    searchString: filter.searchString
      ? filter.searchString.replace(/%/g, "")
      : null,
    selectedTimeCommitment: [
      filter.selectedTimeCommitmentMin,
      filter.selectedTimeCommitmentMax,
    ],
    selectedLocalGroups: filter.selectedLocalGroups
      ? filter.selectedLocalGroups.map(({ name }) => name)
      : [],
    selectedWorkingGroups: filter.selectedWorkingGroups
      ? filter.selectedWorkingGroups.map(({ name }) => name)
      : [],
  };
};
