import { getRoleData } from "./resolvers/getRoleData";
import { updateRoleFilter } from "./resolvers/updateRoleFilter";
import { timeCommitmentRange } from "./resolvers/timeCommitmentRange";
// import { filtered } from "./resolvers/filteredRoles";
import { updateRoleAmount } from "./resolvers/updateRoleAmount";
import { roleDetail } from "./resolvers/roleDetail";
import { filter } from "./resolvers/filter";
import { clearRoleFilter } from "./resolvers/clearRoleFilter";

const resolvers = {
  Query: {
    getRoleData,
  },
  Mutation: {
    updateRoleFilter,
    clearRoleFilter,
    updateRoleAmount,
  },
  RoleData: {
    timeCommitmentRange,
    roleDetail,
    filter,
    // filtered,
  },
};

console.log("Resolvers", resolvers);

export { resolvers };
