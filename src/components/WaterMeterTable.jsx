import {

  tableContainer,

  modernTable,

  modernTh,

  modernTd,

  modernTr,

  statusActive,

  statusInactive,

} from "../styles/theme";

export default function WaterMeterTable({

  meters,

}) {

  return (

    <div style={tableContainer}>

      <table style={modernTable}>

        <thead>

          <tr>

            <th style={modernTh}>
              Apartment
            </th>

            <th style={modernTh}>
              Type
            </th>

            <th style={modernTh}>
              Serial Number
            </th>

            <th style={modernTh}>
              Installed
            </th>

            <th style={modernTh}>
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {meters.map((meter) => (

            <tr
              key={meter.id}
              style={modernTr}
            >

              <td style={modernTd}>
                {meter.apartment_number}
              </td>

              <td style={modernTd}>

                {meter.type === "hot"

                  ? "🔴 Hot"

                  : "🔵 Cold"}

              </td>

              <td style={modernTd}>
                {meter.serial_number}
              </td>

              <td style={modernTd}>

                {meter.installed_at

                  ? meter.installed_at.slice(0, 10)

                  : "-"}

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

  );

}
