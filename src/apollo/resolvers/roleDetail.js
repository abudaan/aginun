import {
  FilteredRoles,
  RoleDetailServer,
  RoleAllInfoServer,
} from "../gql/role.gql";

export const roleDetail = async (_, { id }, { cache, client }) => {
  const roles = cache.readQuery({
    query: FilteredRoles,
  });

  let role = roles.roles.filter(r => r.id === parseInt(id, 10))[0];

  if (role) {
    const data = await client.query({
      query: RoleDetailServer,
      variables: { id },
    });
    const details = data.data.role[0];
    return {
      ...role,
      ...details,
    };
  }

  const data = await client.query({
    query: RoleAllInfoServer,
    variables: { id },
  });

  role = data.data.role[0];

  client.writeQuery({
    query: FilteredRoles,
    data: { roles: [role] },
  });

  return role;
};
