import { useEffect } from "react";

import DashboardCard from "../components/DashboardCard";

import useDashboard from "../hooks/useDashboard";
import { useAuth } from "../context/AuthContext";

import {
  cardStyle,
  dashboardGrid,
} from "../styles/theme";

export default function DashboardPage() {

  const { me } = useAuth();

  const {
    dashboard,
    loadDashboard,
  } = useDashboard();

  const roles = me?.roles || [];

  const mode =
    const { mode } = useMode();
      ? "admin"
      : "resident";

  useEffect(() => {

    if (mode === "admin") {
      loadDashboard();
    }

  }, []);

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
