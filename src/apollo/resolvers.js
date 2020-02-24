import * as groupResolvers from "./resolvers/group";
import {
  roleResolvers,
  filtered,
  timeCommitmentRange,
  getRoleData,
} from "./resolvers/role";

const resolvers = {
  ...groupResolvers,
  Query: {
    getRoleData,
    getId: () => {
      // console.log("get id");
      return { id: 2 };
    },
  },
  Mutation: {
    // roleData,
  },
  RoleData: {
    timeCommitmentRange,
    filtered,
    // ...roleResolvers,
  },
};

// console.log("Resolvers", resolvers);

export { resolvers };
