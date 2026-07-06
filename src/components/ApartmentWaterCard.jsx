import {

  apartmentCard,

  apartmentTitle,

  riserBlock,

  riserTitle,

  meterCard,

  meterLeft,

  meterHistoryButton,

} from "../styles/theme";

export default function ApartmentWaterCard({

  apartment,

  onOpen,

}) {

  return (

    <div style={apartmentCard}>

      {/* Apartment */}

      <div
        style={{
          marginBottom: 18,
        }}
      >

      <button
      
        onClick={onOpen}
      
        style={apartmentTitle}
      
      >
          Apartment {apartment.number}

        </button>

      </div>

      {/* Risers */}

      {apartment.risers.map((riser) => (

          <div
          
            key={riser.name}
          
            style={riserBlock}
          
          >

          <div style={riserTitle}>

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

                style={meterCard}

              >

                {/* Left */}

                  <div style={meterLeft}>

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

                  style={meterHistoryButton}
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
