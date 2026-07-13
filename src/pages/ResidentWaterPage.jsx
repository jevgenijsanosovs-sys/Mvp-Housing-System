import {
  useEffect,
  useState,
} from "react";

import WaterCard from "../components/WaterCard";
import MeterHistoryModal
  from "../components/MeterHistoryModal";

import useWater from "../hooks/useWater";

export default function ResidentWaterPage() {

  const {
    waterMeters,

    meterHistory,
    meterHistoryLoading,

    loadMyWater,
    loadMeterHistory,
    clearMeterHistory,

    submitReading,
  } = useWater();

  const [
    historyOpen,
    setHistoryOpen
  ] = useState(false);

  useEffect(() => {

    loadMyWater();

  }, []);

  const handleOpenHistory =
    async (meterId) => {

      setHistoryOpen(true);

      await loadMeterHistory(
        meterId
      );
    };

  const handleCloseHistory =
    () => {

      setHistoryOpen(false);

      clearMeterHistory();
    };

  const metersByApartment =
    waterMeters.reduce(
      (
        groupedMeters,
        meter
      ) => {

        const apartmentNumber =
          meter.apartment_number ??
          "Unknown";

        if (
          !groupedMeters[
            apartmentNumber
          ]
        ) {
          groupedMeters[
            apartmentNumber
          ] = [];
        }

        groupedMeters[
          apartmentNumber
        ].push(meter);

        return groupedMeters;
      },
      {}
    );

  const apartmentGroups =
    Object.entries(
      metersByApartment
    ).sort(
      ([numberA], [numberB]) =>
        String(numberA).localeCompare(
          String(numberB),
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        )
    );

  return (
    <div>

      <div
        style={{
          marginBottom: 24,
        }}
      >

        <h1
          style={{
            margin: 0,
          }}
        >
          Water Readings
        </h1>

        <p
          style={{
            marginTop: 8,
            marginBottom: 0,
            color: "#6b7280",
            lineHeight: 1.5,
          }}
        >
          Submit the current values
          shown on your water meters.
        </p>

      </div>

      {apartmentGroups.length === 0 ? (

        <div
          style={{
            padding: 24,
            border:
              "1px solid #e5e7eb",
            borderRadius: 16,
            background: "#ffffff",
            color: "#6b7280",
          }}
        >
          No water meters found.
        </div>

      ) : (

        apartmentGroups.map(
          ([
            apartmentNumber,
            meters,
          ]) => (

            <section
              key={apartmentNumber}
              style={{
                marginBottom: 28,
                padding: 20,
                border:
                  "1px solid #e5e7eb",
                borderRadius: 18,
                background: "#ffffff",
                boxShadow:
                  "0 4px 16px rgba(15, 23, 42, 0.05)",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 18,
                  paddingBottom: 14,
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >

                <div>

                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.04em",
                      marginBottom: 4,
                    }}
                  >
                    Apartment
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      fontSize: 22,
                    }}
                  >
                    {apartmentNumber ===
                    "Unknown"
                      ? "Not assigned"
                      : `#${apartmentNumber}`}
                  </h2>

                </div>

                <div
                  style={{
                    padding: "6px 11px",
                    borderRadius: 999,
                    background: "#f3f4f6",
                    color: "#4b5563",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {meters.length}
                  {" "}
                  {meters.length === 1
                    ? "meter"
                    : "meters"}
                </div>

              </div>

              <div
                style={{
                  display: "grid",
                  gap: 16,
                }}
              >

                {meters.map(
                  (meter) => (

                    <WaterCard
                      key={meter.id}
                      meter={meter}
                      onSubmit={
                        submitReading
                      }
                      onHistory={
                        handleOpenHistory
                      }
                    />

                  )
                )}

              </div>

            </section>

          )
        )

      )}

      <MeterHistoryModal
        open={historyOpen}
        history={meterHistory}
        loading={
          meterHistoryLoading
        }
        onClose={
          handleCloseHistory
        }
      />

    </div>
  );
}
