import { useEffect } from "react";

import DashboardCard from "../components/DashboardCard";
import useDashboard from "../hooks/useDashboard";

import { useMode } from "../context/ModeContext";

import {
  cardStyle,
  dashboardGrid,
} from "../styles/theme";

export default function DashboardPage() {

  const { mode } = useMode();

  const {
    dashboard,
    loadDashboard,
  } = useDashboard();

  useEffect(() => {

    if (mode === "admin") {
      loadDashboard();
    }

  }, [mode]);

  return (
    <div>

      <h1>Welcome</h1>

      <p>
        Current mode: {mode}
      </p>

      {mode === "resident" && (
        <>
          <div style={cardStyle}>
            <h3>My Apartment</h3>
          </div>

          <div style={cardStyle}>
            <h3>Announcements</h3>
          </div>

          <div style={cardStyle}>
            <h3>Water Meters</h3>
          </div>
        </>
      )}

      {mode === "admin" && (

        <div style={dashboardGrid}>

          <DashboardCard
            title="Apartments"
            value={dashboard?.apartments || 0}
          />

          <DashboardCard
            title="Users"
            value={dashboard?.users || 0}
          />

          <DashboardCard
            title="Meters"
            value={dashboard?.meters || 0}
          />

          <DashboardCard
            title="Readings"
            value={dashboard?.readings || 0}
          />

        </div>

      )}

    </div>
  );
}