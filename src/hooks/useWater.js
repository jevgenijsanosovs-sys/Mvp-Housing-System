import { useState } from "react";
import { api } from "../services/api";

export default function useWater() {

  // =====================================
  // RESIDENT WATER
  // =====================================

  const [waterMeters, setWaterMeters] =
    useState([]);

  // =====================================
  // ADMIN WATER
  // =====================================

  const [adminWater, setAdminWater] =
    useState([]);

  // =====================================
  // ADMIN WATER METERS
  // =====================================

  const [
    adminWaterMeters,
    setAdminWaterMeters
  ] = useState([]);

  // =====================================
  // LOAD RESIDENT WATER
  // =====================================

  const loadMyWater = async () => {

    const d = await api(
      "/api/my-water-meters"
    );

    setWaterMeters(
      Array.isArray(d) ? d : []
    );
  };

  // =====================================
  // LOAD ADMIN WATER
  // =====================================

  const loadAdminWater = async () => {

    const d = await api(
      "/api/admin/water-readings"
    );

    setAdminWater(
      Array.isArray(d) ? d : []
    );
  };

  // =====================================
  // LOAD ADMIN WATER METERS
  // =====================================

  const loadAdminWaterMeters =
    async () => {

      const d = await api(
        "/api/admin/water-meters"
      );

      setAdminWaterMeters(
        Array.isArray(d)
          ? d
          : []
      );
    };

  // =====================================
  // PARSE READING
  // =====================================

  const parseReadingValue = (
    value
  ) => {

    const normalizedValue =
      String(value)
        .trim()
        .replace(",", ".");

    if (!normalizedValue) {
      return null;
    }

    if (
      !/^\d+(\.\d{1,3})?$/.test(
        normalizedValue
      )
    ) {
      return null;
    }

    const cubicMeters =
      Number(normalizedValue);

    if (
      !Number.isFinite(
        cubicMeters
      ) ||
      cubicMeters < 0
    ) {
      return null;
    }

    return Math.round(
      cubicMeters * 1000
    );
  };

  // =====================================
  // SUBMIT READING
  // =====================================

  const submitReading = async (
    meterId,
    value
  ) => {

    if (
      String(value).trim() === ""
    ) {

      alert("Enter value");

      return false;
    }

    const storedReadingValue =
      parseReadingValue(value);

    if (
      storedReadingValue === null
    ) {

      alert(
        "Enter the reading in m³ with up to 3 decimal places"
      );

      return false;
    }

    try {

      const r = await api(
        "/api/submit-water-reading",
        {
          method: "POST",

          body: JSON.stringify({
            meter_id: meterId,

            reading_value:
              storedReadingValue,
          }),
        }
      );

      if (r.ok) {

        await loadMyWater();

        alert("Submitted");

        return true;
      }

      alert(
        r?.error ||
        "Submit failed"
      );

      return false;

    } catch (error) {

      console.error(
        "Submit reading failed:",
        error
      );

      alert("Submit failed");

      return false;
    }
  };

  // =====================================
  // DEACTIVATE WATER METER
  // =====================================

  const deactivateMeter =
    async (
      meterId,
      reason = "replacement"
    ) => {

      const r = await api(
        "/api/admin/deactivate-water-meter",
        {
          method: "POST",

          body: JSON.stringify({
            meter_id: meterId,
            reason,
          }),
        }
      );

      if (r.ok) {

        loadAdminWaterMeters();

      } else {

        alert(
          r?.error ||
          "Deactivate failed"
        );
      }
    };

  return {

    waterMeters,
    adminWater,
    adminWaterMeters,

    loadMyWater,
    loadAdminWater,
    loadAdminWaterMeters,

    submitReading,
    deactivateMeter,
  };
}
