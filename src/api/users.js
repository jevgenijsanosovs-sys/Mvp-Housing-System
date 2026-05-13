import { api } from "./client";

export function getUsers(token) {
  return api(token, "/api/admin/users");
}