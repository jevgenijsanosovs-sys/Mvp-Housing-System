import Modal from "./Modal";

export default function MeterHistoryModal({
  open,
  history,
  loading,
  onClose,
}) {

  const formatReading = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const storedValue =
      Number(value);

    if (
      !Number.isFinite(
        storedValue
      )
    ) {
      return value;
    }

    return (
      (storedValue / 1000)
        .toFixed(3)
        .replace(".", ",") +
      " m³"
    );
  };

  const formatDate = (value) => {

    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-GB"
    );
  };

  const meter =
    history?.meter || null;

  const readings =
    Array.isArray(
      history?.readings
    )
      ? history.readings
      : [];

  const formatMeterType =
    (type) => {

      const normalizedType =
        String(type || "")
          .trim()
          .toLowerCase();

      if (normalizedType === "cold") {
        return "Cold Water";
      }

      if (normalizedType === "hot") {
        return "Hot Water";
      }

      return "Water Meter";
    };

  const title = meter
    ? formatMeterType(
        meter.type
      )
    : "Meter History";

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
    >

      {loading ? (

        <div
          style={{
            padding: "20px 0",
            color: "#6b7280",
          }}
        >
          Loading history...
        </div>

      ) : (

        <>

          {meter && (

            <div
              style={{
                marginBottom: 18,
                paddingBottom: 14,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >

              {meter.local_label && (

                <div
                  style={{
                    marginBottom: 4,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {meter.local_label}
                </div>

              )}

              <div
                style={{
                  color: "#6b7280",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {meter.riser_code && (
                  <div>
                    Riser:{" "}
                    {meter.riser_code}
                  </div>
                )}

                {meter.serial_number && (
                  <div>
                    Serial number:{" "}
                    {meter.serial_number}
                  </div>
                )}

                {meter.apartment_number && (
                  <div>
                    Apartment:{" "}
                    #{meter.apartment_number}
                  </div>
                )}

              </div>

            </div>

          )}

          {readings.length === 0 ? (

            <div
              style={{
                padding: "16px 0",
                color: "#6b7280",
              }}
            >
              No previous readings.
            </div>

          ) : (

            <div
              style={{
                display: "grid",
                gap: 8,
              }}
            >

              {readings.map(
                (reading) => (

                  <div
                    key={reading.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: 16,
                      padding:
                        "10px 12px",
                      border:
                        "1px solid #e5e7eb",
                      borderRadius: 10,
                      background:
                        "#f9fafb",
                    }}
                  >

                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: 14,
                      }}
                    >
                      {formatDate(
                        reading.reading_date
                      )}
                    </span>

                    <span
                      style={{
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {formatReading(
                        reading.reading_value
                      )}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              marginTop: 18,
              padding: "10px 14px",
              border:
                "1px solid #d1d5db",
              borderRadius: 10,
              background: "#ffffff",
              color: "#374151",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>

        </>

      )}

    </Modal>
  );
}
