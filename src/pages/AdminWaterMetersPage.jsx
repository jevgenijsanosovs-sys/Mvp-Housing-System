import { useEffect } from "react";
import useWater from "../hooks/useWater";

export default function AdminWaterMetersPage() {

  const {
    adminWaterMeters,
    loadAdminWaterMeters,
    deactivateMeter
  } = useWater();

  useEffect(() => {
    loadAdminWaterMeters();
  }, []);

  return (
    <div style={{ padding: 20 }}>

      <h2>Water Meter Management</h2>

      <button
        onClick={loadAdminWaterMeters}
        style={{
          marginBottom: 15,
          padding: 8
        }}
      >
        Refresh
      </button>

      <table
        width="100%"
        cellPadding="8"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th align="left">Apartment</th>
            <th align="left">Type</th>
            <th align="left">Serial</th>
            <th align="left">Installed</th>
            <th align="left">Status</th>
            <th align="left">Last Reading</th>
            <th align="left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {adminWaterMeters.map((m) => (
            <tr key={m.id} style={{ borderTop: "1px solid #ddd" }}>
              <td>{m.apartment_number}</td>
              <td>{m.type}</td>
              <td>{m.serial_number}</td>
              <td>{m.installed_at}</td>
              <td>
                {m.active ? "Active" : "Inactive"}
              </td>
              <td>{m.last_reading ?? "-"}</td>

              <td>
                {m.active && (
                  <button
                    onClick={() =>
                      deactivateMeter(m.id, "replacement")
                    }
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
