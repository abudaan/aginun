import * as groupResolvers from "./resolvers/group";
import {
  getRoleData,
  clearRoleFilter,
  updateTimeCommitmentRole,
} from "./resolvers/role";
import { updateRoleFilter } from "./resolvers/updateRoleFilter";
import { timeCommitmentRange } from "./resolvers/timeCommitmentRange";
// import { filtered } from "./resolvers/filteredRoles";
import { updateRoleAmount } from "./resolvers/updateRoleAmount";

const resolvers = {
  ...groupResolvers,
  Query: {
    getRoleData,
  },
  Mutation: {
    updateRoleFilter,
    clearRoleFilter,
    updateTimeCommitmentRole,
    updateRoleAmount,
  },
  RoleData: {
    timeCommitmentRange,
    // filtered,
  },
};

console.log("Resolvers", resolvers);

export { resolvers };
