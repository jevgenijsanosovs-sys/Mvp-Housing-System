export default function ApartmentWaterTab({
  apartment,
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

          <h3
            style={{
              marginBottom: 12,
              color: "#334155",
            }}
          >
            {riser.name}
          </h3>

          {riser.meters.map((meter) => (

            <div
              key={meter.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
                background: "#fff",
              }}
            >

              <div
                style={{
                  fontWeight: 600,
                }}
              >
                {meter.type === "hot"
                  ? "🔴 Hot Water"
                  : "🔵 Cold Water"}
              </div>

              <div
                style={{
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
                SN {meter.serial_number}
              </div>

            </div>

          ))}

        </div>

      ))}

    </div>

  );

}
