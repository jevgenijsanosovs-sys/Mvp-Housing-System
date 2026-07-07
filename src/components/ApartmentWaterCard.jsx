import {

  apartmentCard,

  apartmentTitle,

  riserBlock,

  riserTitle,

  meterCard,

  meterLeft,

  meterHistoryButton,

} from "../styles/theme";

import MeterRow from "./MeterRow";

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
            
              <MeterRow
            
                key={meter.id}
            
                meter={meter}
            
                onOpen={(meter) => {
            
                  console.log("Open meter", meter);
            
                }}
            
                onHistory={(meter) => {
            
                  console.log("History", meter);
            
                }}
            
              />
            
            ))}

          </div>

        </div>

      ))}

    </div>

  );

}
