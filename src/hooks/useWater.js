import { useState } from "react";
import { api } from "../services/api";

export default function useWater() {

  // =====================================
  // RESIDENT WATER
  // =====================================

  const [waterMeters, setWaterMeters] =
    useState([]);

  // =====================================
  // WATER METER HISTORY
  // =====================================

  const [
    meterHistory,
    setMeterHistory
  ] = useState(null);

  const [
    meterHistoryLoading,
    setMeterHistoryLoading
  ] = useState(false);

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
  // LOAD WATER METER HISTORY
  // =====================================

  const loadMeterHistory =
    async (meterId) => {

      if (!meterId) {
        return null;
      }

      setMeterHistoryLoading(true);
      setMeterHistory(null);

      try {

        const d = await api(
          `/api/my-water-meter-history?id=${meterId}`
        );

        if (
          d?.error
        ) {

          alert(
            d.error ||
            "History load failed"
          );

          return null;
        }

        const historyData = {

          meter:
            d?.meter || null,

          readings:
            Array.isArray(
              d?.readings
            )
              ? d.readings
              : [],
        };

        setMeterHistory(
          historyData
        );

        return historyData;

      } catch (error) {

        console.error(
          "Load meter history failed:",
          error
        );

        alert(
          "History load failed"
        );

        return null;

      } finally {

        setMeterHistoryLoading(
          false
        );
      }
    };

  // =====================================
  // CLEAR WATER METER HISTORY
  // =====================================

  const clearMeterHistory = () => {

    setMeterHistory(null);
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

    meterHistory,
    meterHistoryLoading,

    adminWater,
    adminWaterMeters,

    loadMyWater,
    loadMeterHistory,
    clearMeterHistory,

    loadAdminWater,
    loadAdminWaterMeters,

    submitReading,
    deactivateMeter,
  };
}
