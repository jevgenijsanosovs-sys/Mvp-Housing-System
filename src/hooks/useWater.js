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
    adminWaterMeters,
  
    loadMyWater,
    loadAdminWater,
    loadAdminWaterMeters,
  
    submitReading,
    deactivateMeter,
  };
}
