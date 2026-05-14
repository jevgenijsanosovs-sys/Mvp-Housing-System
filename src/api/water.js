import { api } from "./client";

export function getMyWater(token) {
  return api(
    token,
    "/api/my-water-meters"
  );
}

export function getAdminWater(token) {
  return api(
    token,
    "/api/admin/water-readings"
  );
}

export function submitWaterReading(
  token,
  meterId,
  value
) {
  return api(
    token,
    "/api/submit-water-reading",
    {
      method: "POST",

      body: JSON.stringify({
        meter_id: meterId,
        reading_value: Number(value),
      }),
    }
  );
}