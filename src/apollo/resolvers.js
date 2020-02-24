import * as groupResolvers from "./resolvers/group";
import { roleResolvers, role } from "./resolvers/role";

const resolvers = {
  ...groupResolvers,
  Query: {
    // role,
    // getId: () => {
    //   // console.log("get id");
    //   return 2;
    // },
    getFilterLimitRole: () => 5,
    getFilterSearchStringRole: () => "%gra%",
  },
  Mutation: {
    // roleData,
  },
  RoleData: {
    // filter: parent => {
    //   console.log("adasdasdasdadasdasd", parent);
    //   return parent.filter;
    // },
    // ...roleResolvers,
    limit: () => 10,
  },
};

// console.log("Resolvers", resolvers);

export { resolvers };
