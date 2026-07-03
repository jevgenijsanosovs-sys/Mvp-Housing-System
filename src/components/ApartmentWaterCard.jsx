export default function ApartmentWaterCard({

  apartment,

}) {

  return (

    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 20,
        marginBottom: 24,
        boxShadow: "0 6px 20px rgba(15,23,42,.06)",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >

        <div>

          <h3
            style={{
              margin: 0,
            }}
          >
            Apartment {apartment.number}
          </h3>

          <div
            style={{
              color: "#64748b",
              marginTop: 4,
            }}
          >
            {apartment.owner || "No owner assigned"}
          </div>

        </div>

      </div>

      {apartment.risers.map((riser) => (

        <div
          key={riser.name}
          style={{
            marginBottom: 20,
          }}
        >

          <div
            style={{
              fontWeight: 700,
              color: "#334155",
              marginBottom: 10,
            }}
          >
            {riser.name}
          </div>

          {riser.meters.map((meter) => (

            <div
              key={meter.id}
              style={{
                display: "grid",
                gridTemplateColumns: "42px 1fr auto",
                alignItems: "center",
                gap: 14,
                padding: "12px 0",
                borderTop: "1px solid #f1f5f9",
              }}
            >

              <div
                style={{
                  fontSize: 28,
                }}
              >
                {meter.type === "hot"
                  ? "🔴"
                  : "🔵"}
              </div>

              <div>

                <div
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {meter.serial_number}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                  }}
                >
                  Last reading will appear here
                </div>

              </div>

              <button
                style={{
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                }}
              >
                History
              </button>

            </div>

          ))}

        </div>

      ))}

    </div>

  );

}
