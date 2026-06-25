import { api } from "./client";

// =========================
// GET ALL METERS
// =========================

export function getAdminWaterMeters(
  token
) {
  return api(
    token,
    "/api/admin/water-meters"
  );
}

// =========================
// CREATE METER
// =========================

export function createWaterMeter(
  token,
  data
) {
  return api(
    token,
    "/api/admin/water-meters",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

// =========================
// DEACTIVATE
// =========================

export function deactivateWaterMeter(
  token,
  meterId,
  reason
) {
  return api(
    token,
    "/api/admin/deactivate-water-meter",
    {
      method: "POST",

      body: JSON.stringify({
        meter_id: meterId,
        reason,
      }),
    }
  );
}
