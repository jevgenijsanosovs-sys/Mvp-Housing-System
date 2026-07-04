export default function ApartmentWaterCard({

  apartment,

  onOpen,

}) 

  {

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

      {/* HEADER */}
      <div style={{ marginBottom: 18 }}>

          <button
          
            onClick={onOpen}
          
            style={{
          
              border: "none",
          
              background: "none",
          
              padding: 0,
          
              cursor: "pointer",
          
              fontSize: 20,
          
              fontWeight: 700,
          
              color: "#2563eb",
          
            }}
          
          >
          
            Apartment {apartment.number}
          
          </button>
        </div>

        <div style={{ color: "#64748b", fontSize: 14 }}>
          {apartment.owner || "No owner assigned"}
        </div>

      </div>

      {/* RISERS */}
      {apartment.risers.map((riser) => (

        <div
          key={riser.name}
          style={{
            marginBottom: 18,
            borderTop: "1px solid #f1f5f9",
            paddingTop: 14,
          }}
        >

          {/* RISER TITLE */}
          <div
            style={{
              fontWeight: 700,
              color: "#334155",
              marginBottom: 10,
            }}
          >
            {riser.name}
          </div>

          {/* METERS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {riser.meters.map((meter) => (

              <div
                key={meter.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  border: "1px solid #eef2f7",
                  borderRadius: 12,
                  background: "#fafafa",
                }}
              >

                {/* LEFT */}
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>

                  <div style={{ fontSize: 22 }}>
                    {meter.type === "hot" ? "🔴" : "🔵"}
                  </div>

                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {meter.serial_number}
                    </div>

                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      Last reading: —
                    </div>
                  </div>

                </div>

                {/* RIGHT */}
                <button
                  style={{
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    borderRadius: 8,
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  History
                </button>

              </div>

            ))}

          </div>

        </div>

      ))}

    </div>

  );

}
