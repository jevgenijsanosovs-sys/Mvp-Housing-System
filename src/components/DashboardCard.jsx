import { dashboardCard } from "../styles/theme";

export default function DashboardCard({
  title,
  value,
}) {
  return (
    <div style={dashboardCard}>
      <h3>{title}</h3>

      <div
        style={{
          fontSize: 36,
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
}