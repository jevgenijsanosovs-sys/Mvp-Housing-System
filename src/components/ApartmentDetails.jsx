import { useState } from "react";

import TabBar from "./TabBar";

import SectionCard from "./SectionCard";
import ApartmentWaterTab
  from "./apartment/ApartmentWaterTab";

export default function ApartmentDetails({

  apartment,

}) {

  const [tab, setTab] = useState("Water");

  const [
    selectedMeter,
    setSelectedMeter,
  ] = useState(null);
  

  if (!apartment) {

    return null;

  }

  return (

    <div>


      <TabBar

        tabs={[

          "Water",

          "Residents",

          "Documents",

          "Tasks",

          "History",

        ]}

        value={tab}

        onChange={setTab}

      />

      {tab === "Water" && (
      
        <ApartmentWaterTab
          apartment={apartment}
          onOpenMeter={setSelectedMeter}
        />

        {selectedMeter && (
        
          <div
            style={{
              marginBottom: 20,
              padding: 12,
              borderRadius: 10,
              background: "#dcfce7",
              color: "#166534",
              fontWeight: 600,
            }}
          >
            Selected meter:{" "}
            {selectedMeter.serial_number}
          </div>
        
        )}

      
      )}

      {tab === "Residents" && (
      
        <SectionCard>
      
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No residents data
          </div>
      
        </SectionCard>
      
      )}
      
      {tab === "Documents" && (
      
        <SectionCard>
      
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No documents
          </div>
      
        </SectionCard>
      
      )}
      
      {tab === "Tasks" && (
      
        <SectionCard>
      
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No tasks
          </div>
      
        </SectionCard>
      
      )}

{tab === "History" && (

  <SectionCard>

    <div
      style={{
        padding: 40,
        textAlign: "center",
        color: "#64748b",
      }}
    >
      No history
    </div>

  </SectionCard>

)}

    </div>

  );

}
