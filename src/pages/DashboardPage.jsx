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

  console.log("dashboard", dashboard);

  return (
    <div>

      <div
        style={{
          marginBottom: 30,
        }}
      >
        <h1
          style={{
            marginBottom: 6,
          }}
        >
          Dashboard
        </h1>

        <div
          style={{
            color: "#6b7280",
          }}
        >
          Building overview and statistics
        </div>
      </div>

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
        <>
          <div style={dashboardGrid}>
            <DashboardCard
              title="Apartments"
              value={
                dashboard?.apartments || 0
              }
            />

            <DashboardCard
              title="Residents"
              value={
                dashboard?.users || 0
              }
            />

            <DashboardCard
              title="Water Meters"
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

          <div
            style={{
              marginTop: 30,
              ...cardStyle,
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              Building Summary
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: 20,
                marginTop: 20,
              }}
            >
              <div>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 14,
                  }}
                >
                  Total Apartments
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {dashboard?.apartments || 0}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 14,
                  }}
                >
                  Registered Residents
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {dashboard?.users || 0}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 14,
                  }}
                >
                  Installed Meters
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {dashboard?.meters || 0}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 14,
                  }}
                >
                  Submitted Readings
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {dashboard?.readings || 0}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
