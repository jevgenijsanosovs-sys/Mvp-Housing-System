import {

  useState,

} from "react";

import TabBar

  from "./TabBar";

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

    Apartment {apartment?.number}
  
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

      <h2
        style={{
          marginTop: 0,
          marginBottom: 24,
        }}
      >
        Apartment {apartment.number}
      </h2>

      <InfoRow
        label="Owner"
        value={
          apartment.owner ||
          "Not assigned"
        }
      />

      <InfoRow
        label="Resident"
        value={
          apartment.resident ||
          "Not assigned"
        }
      />

      <InfoRow
        label="Area"
        value={
          apartment.area
            ? `${apartment.area} m²`
            : "-"
        }
      />

      <InfoRow
        label="Floor"
        value={
          apartment.floor ?? "-"
        }
      />

      <InfoRow
        label="Entrance"
        value={
          apartment.entrance ?? "-"
        }
      />

    </div>

  );

}

function InfoRow({

  label,

  value,

}) {

  return (

    <div
      style={{

        display: "flex",

        justifyContent:
          "space-between",

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
