import * as groupResolvers from "./resolvers/group";
import { roleResolvers, filtered, roleData } from "./resolvers/role";
import { GetRoles, GetRoleAmount } from "./gql/role.gql";

const resolvers = {
  ...groupResolvers,
  Query: {
    getRoleData: async (parent, variables, { cache, client }, info) => {
      // const data = await client.readQuery({
      //   query: RoleData,
      // });
      console.log("getRoleData");
      return {
        __typename: "RoleData",
        filter: {
          __typename: "Filter",
          selectedLocalGroups: null,
          selectedWorkingGroups: null,
          selectedTimeCommitmentMin: 2,
          selectedTimeCommitmentMax: 20,
          searchString: null,
          limit: 10,
        },
        timeCommitmentRange: {
          __typename: "Range",
          min: 0,
          max: 40,
        },
        // calculateTimeCommitmentRange: null,
        amount: 0,
        filtered: {
          __typename: "FilteredRoles",
          roles: [],
        },
      };
    },
    getId: () => {
      // console.log("get id");
      return { id: 2 };
    },
    // getFilterLimitRole: () => 5,
    // getFilterSearchStringRole: () => "%gra%",
  },
  Mutation: {
    // roleData,
  },
  RoleData: {
    timeCommitmentRange: (parent, variables, { cache, client }, info) => {
      return {
        __typename: "Range",
        min: 2,
        max: 78,
      };
    },
    filtered,
    // filtered: (parent, variables, { cache, client }, info) => {
    //   console.log("FILTERED");
    // },
    // filter: parent => {
    //   console.log("adasdasdasdadasdasd", parent);
    //   return parent.filter;
    // },
    // ...roleResolvers,
    // limit: () => 10,
  },
};

// console.log("Resolvers", resolvers);

export { resolvers };
