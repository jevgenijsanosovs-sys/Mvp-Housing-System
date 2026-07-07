import { useState } from "react";

import TabBar from "./TabBar";

import ApartmentGeneralTab
  from "./ApartmentGeneralTab";

export default function ApartmentDetails({

  apartment,

}) {

  const [tab, setTab] = useState("General");

  if (!apartment) {

    return null;

  }

  return (

    <div>

      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
        }}
      >
        Apartment {apartment.number}
      </h2>

      <TabBar
        tabs={[
          "General",
          "Water",
          "Residents",
          "Documents",
          "Tasks",
          "History",
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "General" && (
      
        <ApartmentGeneralTab
      
          apartment={apartment}
      
        />
      
      )}
      
            {tab === "Water" && (
      
              <div
                style={{
                  padding: "20px 0",
                  color: "#64748b",
                }}
              >
                Water meters will appear here.
              </div>
      
            )}
      
            {tab === "Residents" && (
      
              <div
                style={{
                  padding: "20px 0",
                  color: "#64748b",
                }}
              >
                Residents will appear here.
              </div>
      
            )}

      {tab === "Documents" && (

        <div
          style={{
            padding: "20px 0",
            color: "#64748b",
          }}
        >
          Documents will appear here.
        </div>

      )}

      {tab === "Tasks" && (

        <div
          style={{
            padding: "20px 0",
            color: "#64748b",
          }}
        >
          Tasks will appear here.
        </div>

      )}

      {tab === "History" && (

        <div
          style={{
            padding: "20px 0",
            color: "#64748b",
          }}
        >
          History will appear here.
        </div>

      )}

    </div>

  );

  return (

    <div
      style={{

        display: "flex",

        justifyContent: "space-between",

        padding: "12px 0",

        borderBottom:
          "1px solid #e5e7eb",

      }}
    >

      <strong>

        {label}

      </strong>

      <span>

        {value}

      </span>

    </div>

  );

}
