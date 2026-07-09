import { useState } from "react";

import TabBar from "./TabBar";
import InfoRow from "./InfoRow";
import SectionCard from "./SectionCard";
import ApartmentWaterTab
  from "./apartment/ApartmentWaterTab";

export default function ApartmentDetails({

  apartment,

}) {

  const [tab, setTab] = useState("Water");

  if (!apartment) {

    return null;

  }

  return (

    <div>

      <div

        style={{

          fontSize: 22,

          fontWeight: 700,

          color: "#2563eb",

          marginBottom: 18,

        }}

      >

        Apartment {apartment.number}

      </div>

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
        />
      
      )}

      {tab === "Residents" && (
        <div>No residents data</div>
      )}
      
      {tab === "Documents" && (
        <div>No documents</div>
      )}
      
      {tab === "Tasks" && (
        <div>No tasks</div>
      )}
      
      {tab === "History" && (
        <div>No history</div>
      )}
      
      {tab !== "Water" && (

        <SectionCard>

          <div

            style={{

              padding: 40,

              textAlign: "center",

              color: "#64748b",

            }}

          >

            {tab}

            {" "}

            module will be implemented later.

          </div>

        </SectionCard>

      )}

    </div>

  );

}
