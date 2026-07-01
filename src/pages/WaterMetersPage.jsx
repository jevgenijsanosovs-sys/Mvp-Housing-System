import { useEffect } from "react";

import PageHeader from "../components/PageHeader";
import ActionButton from "../components/ActionButton";

import useWater from "../hooks/useWater";

import {

  tableContainer,
  
  modernTable,

  modernTh,

  modernTd,

  modernTr,

  statusActive,

  statusInactive,

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

     <div style={tableContainer}>
       <table style={modernTable}>
      
        <thead>
      
          <tr>
      
            <th style={modernTh}>Apartment</th>
      
            <th style={modernTh}>Type</th>
      
            <th style={modernTh}>Serial Number</th>
      
            <th style={modernTh}>Installed</th>
      
            <th style={modernTh}>Status</th>
      
          </tr>
      
        </thead>
      
        <tbody>
      
          {adminWaterMeters.map((meter) => (
      
        <tr
          key={meter.id}
        
          style={modernTr}
        
          onMouseEnter={(e) => {
            if (window.innerWidth >= 768)
              e.currentTarget.style.background =
                "#f8fafc";
          }}
        
          onMouseLeave={(e) => {
            if (window.innerWidth >= 768)
              e.currentTarget.style.background =
                "#ffffff";
          }}
        >
      
              <td style={modernTd}>{meter.apartment_number}</td>
      
              <td style={modernTd}>
                {meter.type === "hot"
                  ? "🔴 Hot"
                  : "🔵 Cold"}
              </td>
      
              <td style={modernTd}>{meter.serial_number}</td>
      
              <td style={modernTd}>
                {meter.installed_at
                  ? meter.installed_at.slice(0, 10)
                  : ""}
              </td>
      
              <td style={modernTd}>
      
                <span
                style={
                meter.active
                ? statusActive
                : statusInactive
                }
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
    </div>

  );

}
