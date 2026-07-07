import InfoRow from "./InfoRow";

export default function WaterMeterDetails({

  meter,

}) {

  if (!meter) {

    return null;

  }

  return (

    <div>

      <h2
        style={{
          marginTop: 0,
          marginBottom: 24,
        }}
      >

        Water Meter

      </h2>

      <InfoRow

        label="Type"

        value={

          meter.type === "hot"

            ? "Hot Water"

            : "Cold Water"

        }

      />

      <InfoRow

        label="Serial Number"

        value={

          meter.serial_number ||

          "-"

        }

      />

      <InfoRow

        label="Riser"

        value={

          meter.riser ||

          "-"

        }

      />

      <InfoRow

        label="Installed"

        value={

          meter.installed_at

            ? meter.installed_at.slice(0, 10)

            : "-"

        }

      />

      <InfoRow

        label="Status"

        value={

          meter.active

            ? "Active"

            : "Inactive"

        }

      />

      <InfoRow

        label="Current Reading"

        value={

          meter.lastReading ??

          "—"

        }

      />

    </div>

  );

}
