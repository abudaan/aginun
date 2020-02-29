import {
  SearchString,
  SelectedLocalGroups,
  SelectedWorkingGroups,
  SelectedTimeCommitment,
} from "../gql/role.gql";

export const clearRoleFilter = (...[, , { client }]) => {
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
