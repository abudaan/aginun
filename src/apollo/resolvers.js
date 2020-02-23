import * as groupResolvers from "./resolvers/group";
import { roleResolvers, roleData } from "./resolvers/role";

const resolvers = {
  ...groupResolvers,
  Query: {
    roleData,
  },
  Mutation: {
    roleData,
  },
  RoleData: {
    ...roleResolvers,
  },
};

// console.log("Resolvers", resolvers);

export { resolvers };
