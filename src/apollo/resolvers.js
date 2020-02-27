import * as groupResolvers from "./resolvers/group";
import {
  filtered,
  getRoleData,
  clearRoleFilter,
  updateTimeCommitmentRole,
} from "./resolvers/role";
import { updateRoleFilter } from "./resolvers/updateRoleFilter";
import { timeCommitmentRange } from "./resolvers/timeCommitmentRange";

const resolvers = {
  ...groupResolvers,
  Query: {
    getRoleData,
  },
  Mutation: {
    updateRoleFilter,
    clearRoleFilter,
    updateTimeCommitmentRole,
  },
  RoleData: {
    timeCommitmentRange,
    filtered,
  },
};

// console.log("Resolvers", resolvers);

export { resolvers };
