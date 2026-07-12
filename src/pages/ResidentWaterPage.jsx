import { useEffect } from "react";

import WaterCard from "../components/WaterCard";
import useWater from "../hooks/useWater";

export default function ResidentWaterPage() {

  const {
    waterMeters,
    loadMyWater,
    submitReading,
  } = useWater();

  useEffect(() => {

    loadMyWater();

  }, []);

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

      <h1
        style={{
          marginBottom: 24,
        }}
      >
        Water Meters
      </h1>

      {apartmentGroups.length === 0 ? (

        <div
          style={{
            padding: 20,
            border:
              "1px solid #e5e7eb",
            borderRadius: 12,
            color: "#6b7280",
            background: "#ffffff",
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
                marginBottom: 32,
              }}
            >

              <div
                style={{
                  marginBottom: 14,
                  paddingBottom: 10,
                  borderBottom:
                    "2px solid #e5e7eb",
                }}
              >

                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                  }}
                >
                  {apartmentNumber ===
                  "Unknown"
                    ? "Apartment"
                    : `Apartment #${apartmentNumber}`}
                </h2>

              </div>

              {meters.map(
                (meter) => (

                  <WaterCard
                    key={meter.id}
                    meter={meter}
                    onSubmit={
                      submitReading
                    }
                  />

                )
              )}

            </section>

          )
        )

      )}

    </div>
  );
}
