import { LocalGroups, WorkingGroups } from "../gql/other.gql";
import { SelectedLocalGroups, SelectedWorkingGroups } from "../gql/role.gql";
import { getRoles } from "./role";

// util function that maps the names of the groups in the dropdown boxes in the drawer
// to their corresponding ids in the database
const mapNames = (names, groups) => {
  const matched = names.map(name => {
    let group;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].name === name) {
        group = groups[i];
        break;
      }
    }
    return group;
  });
  return matched;
};

const updateLocalGroups = (_, { names }, { cache, client }) => {
  const { local_group: groups } = cache.readQuery({
    query: LocalGroups,
  });
  cache.writeQuery({
    query: SelectedLocalGroups,
    data: { selectedLocalGroups: mapNames(names, groups) },
  });
  // console.log(cache.data.data.ROOT_QUERY.selectedLocalGroups);
  getRoles(cache, client);
  return null;
};

const updateWorkingGroups = (...[, { names }, { cache, client }]) => {
  const { working_group: groups } = cache.readQuery({
    query: WorkingGroups,
  });
  cache.writeQuery({
    query: SelectedWorkingGroups,
    data: { selectedWorkingGroups: mapNames(names, groups) },
  });
  getRoles(cache, client);
  // console.log(cache.data.data.ROOT_QUERY.selectedWorkingGroups);
  return null;
};

export { updateLocalGroups, updateWorkingGroups };
