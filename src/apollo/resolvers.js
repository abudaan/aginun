import * as groupResolvers from "./resolvers/group";
import { roleResolvers, roleClient } from "./resolvers/role";

const resolvers = {
  ...groupResolvers,
  Query: {
    roleClient,
  },
  Mutation: {
    roleClient,
  },
  RoleClient: {
    ...roleResolvers,
  },
};

console.log("Resolvers", resolvers);

export { resolvers };
