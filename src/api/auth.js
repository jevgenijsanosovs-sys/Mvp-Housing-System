import { api } from "./client";

export function loginRequest(email, password) {
  return api(
    null,
    "/api/login",
    {
      method: "POST",

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );
}

export function getMe(token) {
  return api(token, "/api/me");
}