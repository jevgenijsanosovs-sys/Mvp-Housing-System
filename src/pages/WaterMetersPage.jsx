import { useEffect } from "react";

import PageHeader from "../components/PageHeader";
import ActionButton from "../components/ActionButton";

import useWater from "../hooks/useWater";

import {
  tableStyle,
} from "../styles/theme";

export default function WaterMetersPage() {

  const {

    adminWaterMeters,

    loadAdminWaterMeters,

  } = useWater();

  useEffect(() => {

    loadAdminWaterMeters();

  }, []);

  return (

    <div>

      <PageHeader
        title="Water Meter Management"
      >
      
        <ActionButton
          text="Refresh"
          onClick={loadAdminWaterMeters}
        />
      
        <ActionButton

          text="Add Meter"
        />
      
        <ActionButton

          text="Deactivate"
          variant="danger"
        />
      
      </PageHeader>

      <table style={tableStyle}>
      
        <thead>
      
          <tr>
      
            <th>Apartment</th>
      
            <th>Type</th>
      
            <th>Serial Number</th>
      
            <th>Installed</th>
      
            <th>Status</th>
      
          </tr>
      
        </thead>
      
        <tbody>
      
          {adminWaterMeters.map((meter) => (
      
            <tr key={meter.id}>
      
              <td>{meter.apartment_number}</td>
      
              <td>{meter.type}</td>
      
              <td>{meter.serial_number}</td>
      
              <td>
                {meter.installed_at
                  ? meter.installed_at.slice(0, 10)
                  : ""}
              </td>
      
              <td>
      
              <span
                style={{
                  color: meter.active
                    ? "#16a34a"
                    : "#9ca3af",
                  fontWeight: 600,
                }}
              >
                {meter.active
                  ? "Active"
                  : "Inactive"}
              </span>
      
              </td>
      
            </tr>
      
          ))}
      
        </tbody>
      
      </table>
    </div>

  );

}
