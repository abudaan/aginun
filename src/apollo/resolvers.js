import * as groupResolvers from "./resolvers/group";
import {
  filtered,
  timeCommitmentRange,
  getRoleData,
  updateLocalGroups,
  updateRoleFilter,
} from "./resolvers/role";

const resolvers = {
  ...groupResolvers,
  Query: {
    getRoleData,
  },
  Mutation: {
    updateRoleFilter,
  },
  RoleData: {
    timeCommitmentRange,
    filtered,
  },
};

// console.log("Resolvers", resolvers);

export { resolvers };
