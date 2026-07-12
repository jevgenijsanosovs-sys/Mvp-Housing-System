import { useState } from "react";

import Drawer from "./Drawer";
import SectionCard from "./SectionCard";
import TabBar from "./TabBar";

import ApartmentWaterTab
  from "./apartment/ApartmentWaterTab";

export default function ApartmentDetails({
  apartment,
}) {

  const [tab, setTab] =
    useState("Water");

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

      <Drawer
        open={!!selectedMeter}
        title={
          selectedMeter
            ? `Meter ${selectedMeter.serial_number}`
            : "Water Meter"
        }
        onClose={() =>
          setSelectedMeter(null)
        }
      >

        {selectedMeter && (

          <div>

            <h2
              style={{
                marginTop: 0,
              }}
            >
              Water Meter
            </h2>

            <p>
              Serial Number:{" "}
              <strong>
                {selectedMeter.serial_number}
              </strong>
            </p>

            <p>
              Type:{" "}
              <strong>
                {selectedMeter.type === "hot"
                  ? "Hot Water"
                  : "Cold Water"}
              </strong>
            </p>

          </div>

        )}

      </Drawer>

    </div>

  );

}
