import { useState } from "react";

import TabBar from "./TabBar";
import InfoRow from "./InfoRow";
import SectionCard from "./SectionCard";

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

        <SectionCard title="General">

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

              apartment.floor ??

              "-"

            }

          />

          <InfoRow

            label="Entrance"

            value={

              apartment.entrance ??

              "-"

            }

          />

        </SectionCard>

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
