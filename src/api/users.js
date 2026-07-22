import {
  api,
} from "./client";

export function getUsers(
  token
) {
  return api(
    token,
    "/api/admin/users"
  );
}

export function createUser(
  token,
  data
) {
  return api(
    token,
    "/api/admin/create-user",
    {
      method: "POST",
      body:
        JSON.stringify(
          data
        ),
    }
  );
}

export function updateUser(
  token,
  data
) {
  return api(
    token,
    "/api/admin/update-user",
    {
      method: "POST",
      body:
        JSON.stringify(
          data
        ),
    }
  );
}

export function setUserStatus(
  token,
  userId,
  isActive
) {
  return api(
    token,
    "/api/admin/set-user-status",
    {
      method: "POST",
      body:
        JSON.stringify({
          id: userId,
          is_active:
            isActive
              ? 1
              : 0,
        }),
    }
  );
}
