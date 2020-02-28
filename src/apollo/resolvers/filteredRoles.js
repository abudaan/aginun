import { GetRoles, GetRoles2, GetFilter } from "../gql/role.gql";
import gql from "graphql-tag";

const query1 = gql`
  query GetAmountCache {
    roleData @client {
      amount
    }
  }
`;

const query2 = gql`
  query GetFilteredRolesCache {
    roleData @client {
      filtered {
        roles
      }
    }
  }
`;

export const filtered = async (
  parent,
  variables,
  { cache, client, getCacheKey },
  info
) => {
  console.log("FILTERED ROLES", variables);

  const {
    roleData: { filter },
  } = client.readQuery({
    query: GetFilter,
  });

  delete filter.id;
  delete filter.__typename;

  const {
    data: { role: roles },
  } = await client.query({
    // query: GetRoles,
    query: GetRoles2,
    variables: { ...filter },
  });

  client.writeQuery({
    query: query1,
    data: {
      roleData: {
        id: "data",
        __typename: "RoleData",
        amount: roles.length,
      },
    },
  });

  client.writeQuery({
    query: query2,
    data: {
      roleData: {
        id: "data",
        __typename: "RoleData",
        filtered: {
          id: "filtered_roles",
          __typename: "FilteredRoles",
          roles,
        },
      },
    },
  });
  // console.log(roles);
  // const d = cache.readQuery({
  //   query: query2,
  // });
  // console.log("retrieved", d);

  return {
    typename: "FilteredRoles",
    roles,
  };
};
