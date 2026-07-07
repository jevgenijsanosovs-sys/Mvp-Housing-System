import { useState } from "react";

import InfoRow from "./InfoRow";
import TabBar from "./TabBar";

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
          marginBottom: 20,
        }}
      >

        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#2563eb",
          }}
        >
          Apartment {apartment.number}
        </div>

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

        <>

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

        </>

      )}

      {tab !== "Water" && (

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

      )}

    </div>

  );

}
