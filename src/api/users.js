import { api } from "./client";

export function getUsers(token) {
  return api(token, "/api/admin/users");
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

      body: JSON.stringify(data),
    }
  );
}