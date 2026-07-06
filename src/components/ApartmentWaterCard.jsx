export default function ApartmentWaterCard({

  apartment,

  onOpen,

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

      {/* Apartment */}

      <div
        style={{
          marginBottom: 18,
        }}
      >

        <button

          onClick={onOpen}

          style={{

            border: "none",

            background: "none",

            padding: 0,

            cursor: "pointer",

            fontSize: 18,

            fontWeight: 600,

            color: "#2563eb",

          }}

        >

          Apartment {apartment.number}

        </button>

      </div>

      {/* Risers */}

      {apartment.risers.map((riser) => (

        <div

          key={riser.name}

          style={{

            marginBottom: 18,

            borderTop: "1px solid #f1f5f9",

            paddingTop: 14,

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

          <div

            style={{

              display: "flex",

              flexDirection: "column",

              gap: 12,

            }}

          >

            {riser.meters.map((meter) => (

              <div

                key={meter.id}

                onClick={() => {

                  console.log("Open meter", meter);

                }}

                style={{

                  display: "flex",

                  justifyContent: "space-between",

                  alignItems: "center",

                  padding: "10px 12px",

                  border: "1px solid #eef2f7",

                  borderRadius: 12,

                  background: "#fafafa",

                  cursor: "pointer",

                  transition: "0.15s",

                }}

              >

                {/* Left */}

                <div

                  style={{

                    display: "flex",

                    alignItems: "center",

                    gap: 10,

                    flex: 1,

                  }}

                >

                  <div

                    style={{

                      fontSize: 22,

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

                        fontSize: 14,

                        color: "#334155",

                      }}

                    >

                      {meter.type === "hot"

                        ? "Hot Water"

                        : "Cold Water"}

                    </div>

                    <div

                      style={{

                        fontSize: 13,

                        color: "#64748b",

                      }}

                    >

                      SN {meter.serial_number}

                    </div>

                    <div

                      style={{

                        fontSize: 12,

                        color: "#64748b",

                        marginTop: 2,

                      }}

                    >

                      Reading{" "}

                      <strong>

                        {meter.lastReading ?? "—"}

                      </strong>{" "}

                      {meter.unit ?? "L"}

                    </div>

                    <div

                      style={{

                        fontSize: 11,

                        color: "#94a3b8",

                      }}

                    >

                      {meter.lastReadingDate ?? ""}

                    </div>

                  </div>

                </div>

                {/* Right */}

                <button

                  onClick={(e) => {

                    e.stopPropagation();

                    console.log("History", meter);

                  }}

                  style={{

                    padding: "5px 10px",

                    borderRadius: 6,

                    border: "1px solid #2563eb",

                    background: "#ffffff",

                    color: "#2563eb",

                    fontSize: 11,

                    cursor: "pointer",

                    fontWeight: 600,

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
