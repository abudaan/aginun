import * as groupResolvers from "./resolvers/group";
import { filtered, timeCommitmentRange, getRoleData } from "./resolvers/role";

const resolvers = {
  ...groupResolvers,
  Query: {
    getRoleData,
  },
  Mutation: {
    // roleData,
  },
  RoleData: {
    timeCommitmentRange,
    filtered,
  },
};

// console.log("Resolvers", resolvers);

export { resolvers };
