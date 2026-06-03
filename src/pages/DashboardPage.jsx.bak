import DashboardCard from "../components/DashboardCard";

import {
  cardStyle,
  dashboardGrid,
} from "../styles/theme";

export default function DashboardScreen({
  mode,
  dashboard,
}) {
  return (
    <div>

      <h1>
        Welcome
      </h1>

      <p>
        Current mode:
        {" "}
        {mode?.toUpperCase() || "UNKNOWN"}
      </p>

      {mode === "resident" && (
        <>

          <div style={cardStyle}>
            <h3>
              My Apartment
            </h3>

            <p>
              Apartment info panel
            </p>
          </div>

          <div style={cardStyle}>
            <h3>
              Announcements
            </h3>

            <p>
              Building announcements
            </p>
          </div>

          <div style={cardStyle}>
            <h3>
              Water Meters
            </h3>

            <p>
              Last submitted readings
            </p>
          </div>

        </>
      )}

      {mode === "admin" && (

        <div style={dashboardGrid}>

          <DashboardCard
            title="Apartments"
            value={
              dashboard?.apartments || 0
            }
          />

          <DashboardCard
            title="Users"
            value={
              dashboard?.users || 0
            }
          />

          <DashboardCard
            title="Meters"
            value={
              dashboard?.meters || 0
            }
          />

          <DashboardCard
            title="Readings"
            value={
              dashboard?.readings || 0
            }
          />

        </div>
      )}

    </div>
  );
}
