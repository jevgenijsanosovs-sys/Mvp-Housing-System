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
  // SUBMIT READING
  // =====================================

  const submitReading = async (
    meterId,
    value
  ) => {

    if (!value) {

      alert("Enter value");

      return;
    }

    const r = await api(
      "/api/submit-water-reading",
      {
        method: "POST",

        body: JSON.stringify({
          meter_id: meterId,
          reading_value: Number(value),
        }),
      }
    );

    if (r.ok) {

      alert("Submitted");

      loadMyWater();

    } else {

      alert(
        r?.error || "Submit failed"
      );

    }
  };

  return {

    waterMeters,
    adminWater,

    loadMyWater,
    loadAdminWater,

    submitReading,
  };
}