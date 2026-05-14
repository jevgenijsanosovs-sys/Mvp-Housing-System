import { api } from "./client";

export function getApartments(token) {
  return api(
    token,
    "/api/apartments/full"
  );
}

export function createApartment(
  token,
  data
) {
  return api(
    token,
    "/api/admin/create-apartment",
    {
      method: "POST",

      body: JSON.stringify(data),
    }
  );
}

export function getUserApartments(
  token,
  userId
) {
  return api(
    token,
    "/api/admin/user-apartments?user_id=" +
      userId
  );
}

export function addUserApartment(
  token,
  data
) {
  return api(
    token,
    "/api/admin/add-user-apartment",
    {
      method: "POST",

      body: JSON.stringify(data),
    }
  );
}

export function removeUserApartment(
  token,
  assignmentId
) {
  return api(
    token,
    "/api/admin/remove-user-apartment",
    {
      method: "POST",

      body: JSON.stringify({
        assignment_id: assignmentId,
      }),
    }
  );
}