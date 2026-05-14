import { api } from "./client";

export function getDashboard(token) {
  return api(
    token,
    "/api/admin/dashboard"
  );
}