export default function ApartmentWaterTab({
  apartment,
  onOpenMeter,
}) {

  return (

    <div>

      {apartment.risers?.map((riser) => (

        <div
          key={riser.name}
          style={{
            marginBottom: 24,
          }}
        >

          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#334155",
              marginBottom: 12,
            }}
          >
            {riser.name} TEST-777
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >

            {riser.meters.map((meter) => (

          <button
            key={meter.id}
            onClick={() => {
              alert(`Meter ${meter.serial_number}`);
              onOpenMeter?.(meter);
            }}
            style={{
              width: "100%",
              textAlign: "left",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 14,
              background: "#ffffff",
              cursor: "pointer",
            }}
          >
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {meter.type === "hot"
                    ? "🔴 Hot Water"
                    : "🔵 Cold Water"}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: "#64748b",
                  }}
                >
                  SN {meter.serial_number}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                    marginTop: 4,
                  }}
                >
                  Last reading: —
                </div>

              </button>

            ))}

          </div>

        </div>

      ))}

    </div>

  );

}
