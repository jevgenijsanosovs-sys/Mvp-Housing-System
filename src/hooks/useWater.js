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
  // ADMIN MONTHLY REPORT
  // =====================================

  const [
    adminMonthlyReport,
    setAdminMonthlyReport
  ] = useState(null);

  const [
    adminMonthlyReportLoading,
    setAdminMonthlyReportLoading
  ] = useState(false);

  const [
    adminMonthlyReportError,
    setAdminMonthlyReportError
  ] = useState("");

  // =====================================
  // CURRENT WATER REPORTING PERIOD
  // =====================================

  const [
    currentWaterReportingPeriod,
    setCurrentWaterReportingPeriod
  ] = useState(null);

  const [
    currentWaterReportingPeriodLoading,
    setCurrentWaterReportingPeriodLoading
  ] = useState(false);

  const [
    currentWaterReportingPeriodError,
    setCurrentWaterReportingPeriodError
  ] = useState("");

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

        if (d?.error) {

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
  // LOAD CURRENT WATER REPORTING PERIOD
  // =====================================

  const loadCurrentWaterReportingPeriod =
    async () => {

      setCurrentWaterReportingPeriodLoading(
        true
      );

      setCurrentWaterReportingPeriodError(
        ""
      );

      try {

        const d = await api(
          "/api/admin/current-water-reporting-period"
        );

        if (d?.error) {

          const messages = {

            forbidden:
              "Administrator access required.",

            reporting_period_not_found:
              "Reporting period not found.",
          };

          const errorMessage =
            messages[d.error] ||
            d.error ||
            "Reporting period load failed";

          setCurrentWaterReportingPeriodError(
            errorMessage
          );

          setCurrentWaterReportingPeriod(
            null
          );

          return null;
        }

        const periodData = {

          period:
            d?.period || null,

          selection_reason:
            d?.selection_reason || "",
        };

        setCurrentWaterReportingPeriod(
          periodData
        );

        return periodData;

      } catch (error) {

        console.error(
          "Load current water reporting period failed:",
          error
        );

        setCurrentWaterReportingPeriodError(
          "Reporting period load failed"
        );

        setCurrentWaterReportingPeriod(
          null
        );

        return null;

      } finally {

        setCurrentWaterReportingPeriodLoading(
          false
        );
      }
    };

  // =====================================
  // CLEAR CURRENT WATER REPORTING PERIOD
  // =====================================

  const clearCurrentWaterReportingPeriod =
    () => {

      setCurrentWaterReportingPeriod(
        null
      );

      setCurrentWaterReportingPeriodError(
        ""
      );
    };

  // =====================================
  // LOAD ADMIN MONTHLY REPORT
  // =====================================

  const loadAdminMonthlyReport =
    async (
      year,
      month
    ) => {

      const reportYear =
        Number(year);

      const reportMonth =
        Number(month);

      if (
        !Number.isInteger(
          reportYear
        ) ||
        reportYear < 2000 ||
        reportYear > 2100
      ) {

        setAdminMonthlyReportError(
          "Invalid reporting year"
        );

        return null;
      }

      if (
        !Number.isInteger(
          reportMonth
        ) ||
        reportMonth < 1 ||
        reportMonth > 12
      ) {

        setAdminMonthlyReportError(
          "Invalid reporting month"
        );

        return null;
      }

      setAdminMonthlyReportLoading(
        true
      );

      setAdminMonthlyReportError(
        ""
      );

      try {

        const d = await api(
          `/api/admin/water-monthly-report?year=${reportYear}&month=${reportMonth}`
        );

        if (d?.error) {

          const messages = {

            forbidden:
              "Administrator access required.",

            invalid_year:
              "Invalid reporting year.",

            invalid_month:
              "Invalid reporting month.",

            reporting_period_not_found:
              "Reporting period not found.",
          };

          const errorMessage =
            messages[d.error] ||
            d.error ||
            "Monthly report load failed";

          setAdminMonthlyReportError(
            errorMessage
          );

          setAdminMonthlyReport(
            null
          );

          return null;
        }

        const reportData = {

          period:
            d?.period || null,

          summary:
            d?.summary || {
              apartments_total: 0,
              apartments_submitted: 0,
              apartments_missing: 0,

              meters_total: 0,
              meters_submitted: 0,
              meters_missing: 0,

              meters_missing_previous: 0,

              meters_negative_consumption: 0,

              cold_consumption: 0,
              hot_consumption: 0,
            },

          missing_apartments:
            Array.isArray(
              d?.missing_apartments
            )
              ? d.missing_apartments
              : [],

          rows:
            Array.isArray(
              d?.rows
            )
              ? d.rows
              : [],
        };

        setAdminMonthlyReport(
          reportData
        );

        return reportData;

      } catch (error) {

        console.error(
          "Load admin monthly report failed:",
          error
        );

        setAdminMonthlyReportError(
          "Monthly report load failed"
        );

        setAdminMonthlyReport(
          null
        );

        return null;

      } finally {

        setAdminMonthlyReportLoading(
          false
        );
      }
    };

  // =====================================
  // CLEAR ADMIN MONTHLY REPORT
  // =====================================

  const clearAdminMonthlyReport =
    () => {

      setAdminMonthlyReport(null);

      setAdminMonthlyReportError(
        ""
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

      const messages = {

        water_collection_period_closed:
          "Water reading collection is currently closed.",

        reading_already_submitted_for_period:
          "A reading has already been submitted for this reporting period.",

        meter_not_allowed:
          "You cannot submit a reading for this meter.",
      };

      alert(
        messages[r?.error] ||
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
  // ADMIN SUBMIT READING
  // =====================================

  const submitAdminReading =
    async (
      meterId,
      value,
      submissionSource,
      sourceNote,
      options = {}
    ) => {

      if (!meterId) {

        alert(
          "Water meter not selected"
        );

        return false;
      }

      const storedReadingValue =
        parseReadingValue(
          value
        );

      if (
        storedReadingValue ===
        null
      ) {

        alert(
          "Enter the reading in m³ with up to 3 decimal places"
        );

        return false;
      }

      const normalizedSource =
        String(
          submissionSource || ""
        )
          .trim()
          .toLowerCase();

      const allowedSources = [
        "paper_note",
        "email",
        "phone",
        "admin_manual",
      ];

      const {
        suppressSuccessAlert = false,
        suppressReload = false,
      } = options;

      if (
        !allowedSources.includes(
          normalizedSource
        )
      ) {

        alert(
          "Select a valid reading source"
        );

        return false;
      }

      const normalizedNote =
        String(
          sourceNote || ""
        ).trim();

      if (!normalizedNote) {

        alert(
          "Enter a source note"
        );

        return false;
      }

      try {

        const r = await api(
          "/api/admin/submit-water-reading",
          {
            method: "POST",

            body: JSON.stringify({
              meter_id:
                meterId,

              reading_value:
                storedReadingValue,

              submission_source:
                normalizedSource,

              source_note:
                normalizedNote,
            }),
          }
        );

        if (r?.ok) {

          if (!suppressReload) {

            const reportPeriod =
              adminMonthlyReport
                ?.period;

            if (
              reportPeriod
                ?.period_year &&
              reportPeriod
                ?.period_month
            ) {

              await loadAdminMonthlyReport(
                reportPeriod
                  .period_year,

                reportPeriod
                  .period_month
              );
            }

            await loadAdminWater();
          }

          if (
            !suppressSuccessAlert
          ) {

            alert(
              "Reading submitted"
            );
          }

          return true;
        }

        const messages = {

          forbidden:
            "Administrator access required.",

          invalid_meter_id:
            "Invalid water meter.",

          invalid_reading_value:
            "Invalid water reading.",

          invalid_submission_source:
            "Invalid reading source.",

          missing_source_note:
            "Enter a source note.",

          meter_not_found_or_inactive:
            "Water meter not found or inactive.",

          water_collection_period_closed:
            "Water reading collection is currently closed.",

          reading_already_submitted_for_period:
            "A reading has already been submitted for this meter and reporting period.",
        };

        alert(
          messages[r?.error] ||
          r?.error ||
          "Admin submission failed"
        );

        return false;

      } catch (error) {

        console.error(
          "Admin submit reading failed:",
          error
        );

        alert(
          "Admin submission failed"
        );

        return false;
      }
    };

  // =====================================
  // CORRECT READING
  // =====================================

  const correctReading = async (
    readingId,
    value,
    reason
  ) => {

    if (!readingId) {

      alert(
        "Reading not selected"
      );

      return false;
    }

    const storedReadingValue =
      parseReadingValue(value);

    if (
      storedReadingValue === null
    ) {

      alert(
        "Enter the corrected reading in m³ with up to 3 decimal places"
      );

      return false;
    }

    const correctionReason =
      String(reason || "")
        .trim();

    if (!correctionReason) {

      alert(
        "Enter correction reason"
      );

      return false;
    }

    try {

      const r = await api(
        "/api/correct-water-reading",
        {
          method: "POST",

          body: JSON.stringify({
            reading_id:
              readingId,

            reading_value:
              storedReadingValue,

            reason:
              correctionReason,
          }),
        }
      );

      if (r.ok) {

        const meterId =
          meterHistory?.meter?.id;

        if (meterId) {

          await loadMeterHistory(
            meterId
          );
        }

        await loadMyWater();

        alert(
          "Reading corrected"
        );

        return true;
      }

      const messages = {

        reading_not_active:
          "This reading has already been replaced.",

        only_latest_reading_can_be_corrected:
          "Only the latest reading can be corrected.",

        reading_value_unchanged:
          "The corrected value is the same as the current value.",

        reading_not_allowed:
          "You cannot correct this reading.",

        reading_period_not_assigned:
          "This reading is not assigned to a reporting period.",

        water_collection_period_closed:
          "The reporting period is closed. This reading can no longer be corrected.",
      };

      alert(
        messages[r?.error] ||
        r?.error ||
        "Correction failed"
      );

      return false;

    } catch (error) {

      console.error(
        "Correct reading failed:",
        error
      );

      alert(
        "Correction failed"
      );

      return false;
    }
  };

  // =====================================
  // ADD WATER METER
  // =====================================

  const addWaterMeter =
    async ({
      apartmentId,
      apartmentRiserId = null,
      type,
      serialNumber,
      installedAt,
    }) => {

      const normalizedApartmentId =
        Number(apartmentId);

      const normalizedType =
        String(type || "")
          .trim()
          .toLowerCase();

      const normalizedSerialNumber =
        String(
          serialNumber || ""
        ).trim();

      if (
        !Number.isInteger(
          normalizedApartmentId
        ) ||
        normalizedApartmentId <= 0
      ) {

        alert(
          "Select an apartment"
        );

        return false;
      }

      if (
        ![
          "cold",
          "hot",
        ].includes(
          normalizedType
        )
      ) {

        alert(
          "Select a water meter type"
        );

        return false;
      }

      if (!normalizedSerialNumber) {

        alert(
          "Enter serial number"
        );

        return false;
      }

      try {

        const result = await api(
          "/api/admin/water-meters",
          {
            method: "POST",

            body: JSON.stringify({
              apartment_id:
                normalizedApartmentId,

              apartment_riser_id:
                apartmentRiserId
                  ? Number(
                      apartmentRiserId
                    )
                  : null,

              type:
                normalizedType,

              serial_number:
                normalizedSerialNumber,

              installed_at:
                installedAt || null,
            }),
          }
        );

        if (result?.ok) {

          await loadAdminWaterMeters();

          alert(
            "Water meter added"
          );

          return true;
        }

        alert(
          result?.error ||
          "Add water meter failed"
        );

        return false;

      } catch (error) {

        console.error(
          "Add water meter failed:",
          error
        );

        alert(
          "Add water meter failed"
        );

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

    adminMonthlyReport,
    adminMonthlyReportLoading,
    adminMonthlyReportError,

    currentWaterReportingPeriod,
    currentWaterReportingPeriodLoading,
    currentWaterReportingPeriodError,

    loadMyWater,
    loadMeterHistory,
    clearMeterHistory,

    loadAdminWater,
    loadAdminWaterMeters,

    loadAdminMonthlyReport,
    clearAdminMonthlyReport,

    loadCurrentWaterReportingPeriod,
    clearCurrentWaterReportingPeriod,

    submitReading,
    submitAdminReading,
    correctReading,

    addWaterMeter,
    deactivateMeter,
  };
}
