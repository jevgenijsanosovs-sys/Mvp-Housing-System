import { useEffect } from "react";

import useWater from "../hooks/useWater";

import {
  tableStyle,
} from "../styles/theme";

export default function WaterReadingsPage() {

  const {
    adminWater,
    loadAdminWater,
  } = useWater();

  useEffect(() => {
    loadAdminWater();
  }, []);

  return (
    <div>

      <h1>
        Water Readings
      </h1>

      <table style={tableStyle}>

        <thead>
          <tr>
            <th>Apartment</th>
            <th>Type</th>
            <th>Serial</th>
            <th>Value</th>
            <th>Date</th>
            <th>User</th>
          </tr>
        </thead>

        <tbody>

          {adminWater.map((r, i) => (

            <tr key={i}>

              <td>{r.apartment_number}</td>
              <td>{r.type}</td>
              <td>{r.serial_number}</td>
              <td>{r.reading_value}</td>
              <td>{r.reading_date}</td>

              <td>
                {r.first_name}
                {" "}
                {r.last_name}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
