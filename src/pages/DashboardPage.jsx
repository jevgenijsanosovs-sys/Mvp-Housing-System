import { useEffect } from "react";

import useDashboard from "../hooks/useDashboard";

import { useMode } from "../context/ModeContext";

import { cardStyle } from "../styles/theme";

import useApartments from "../hooks/useApartments";

export default function DashboardPage() {
  const { mode } = useMode();

  const {
    dashboard,
    loadDashboard,
  } = useDashboard();

  const {
  apartments,
  loadApartments,
} = useApartments();

  useEffect(() => {
    if (mode === "admin") {
      loadDashboard();
      loadApartments();
    }
  }, [mode]);

  console.log("dashboard", dashboard);

  const livingArea = apartments.reduce(
    (sum, a) =>
      sum + Number(a.living_area || 0),
    0
  );

  const nonLivingArea = apartments.reduce(
    (sum, a) =>
      sum + Number(a.non_living_area || 0),
    0
  );

  const heatedArea = apartments.reduce(
    (sum, a) =>
      sum + Number(a.heated_area || 0),
    0
  );


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

            <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 20,
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "10px 0" }}>
                  Apartments
                </td>
                <td>
                  <strong>
                    {dashboard?.stats?.apartments || 0}
                  </strong>
                </td>
              </tr>

              <tr>
                <td style={{ padding: "10px 0" }}>
                  Residents
                </td>
                <td>
                  <strong>
                    {dashboard?.stats?.users || 0}
                  </strong>
                </td>
              </tr>

              <tr>
                <td style={{ padding: "10px 0" }}>
                  Living Area
                </td>
                <td>
                  <strong>
                    {livingArea.toFixed(2)}
                  </strong>
                </td>
              </tr>

              <tr>
                <td style={{ padding: "10px 0" }}>
                  Non Living Area
                </td>
                <td>
                  <strong>
                    {nonLivingArea.toFixed(2)}
                  </strong>
                </td>
              </tr>

              <tr>
                <td style={{ padding: "10px 0" }}>
                  Heated Area
                </td>
                <td>
                  <strong>
                    {heatedArea.toFixed(2)}
                  </strong>
                </td>
              </tr>

              <tr>
                <td style={{ padding: "10px 0" }}>
                  Land Tax Area
                </td>
                <td>—</td>
              </tr>

              <tr>
                <td style={{ padding: "10px 0" }}>
                  Alternative Heating Area
                </td>
                <td>—</td>
              </tr>

              <tr>
                <td style={{ padding: "10px 0" }}>
                  Water Readings (last month)
                </td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(350px,1fr))",
              gap: 20,
              marginTop: 20,
            }}
          >
            <div style={cardStyle}>
              <h3>Announcements</h3>
              <p>No announcements</p>
            </div>

            <div style={cardStyle}>
              <h3>Repair Tickets</h3>
              <p>No open tickets</p>
            </div>

            <div style={cardStyle}>
              <h3>Projects</h3>
              <p>No active projects</p>
            </div>

            <div style={cardStyle}>
              <h3>Water Monitoring</h3>
              <p>Monitoring module coming soon</p>
            </div>

            <div style={cardStyle}>
              <h3>Recent Activity</h3>
              <p>No recent activity</p>
            </div>
          </div>

        </>
      )}
    </div>
  );
}
