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
      storedValue / 1000
    )
      .toFixed(3)
      .replace(".", ",");
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

  const meter =
    history?.meter || null;

  const readings =
    Array.isArray(
      history?.readings
    )
      ? history.readings
      : [];

  const title = meter
    ? `${formatMeterType(
        meter.type
      )} History`
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
            padding: "14px 0",
            color: "#6b7280",
            fontSize: 14,
          }}
        >
          Loading history...
        </div>

      ) : (

        <>

          {meter && (

            <div
              style={{
                marginBottom: 14,
                paddingBottom: 12,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >

              {meter.local_label && (

                <div
                  style={{
                    marginBottom: 7,
                    color: "#111827",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {meter.local_label}
                </div>

              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "auto 1fr",
                  columnGap: 12,
                  rowGap: 4,
                  color: "#4b5563",
                  fontSize: 12,
                  lineHeight: 1.4,
                }}
              >

                <span>
                  Apartment
                </span>

                <span
                  style={{
                    textAlign: "right",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {meter.apartment_number
                    ? `#${meter.apartment_number}`
                    : "—"}
                </span>

                <span>
                  Riser
                </span>

                <span
                  style={{
                    textAlign: "right",
                    fontWeight: 600,
                    color: "#111827",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  }}
                >
                  {meter.riser_code || "—"}
                </span>

                <span>
                  Serial number
                </span>

                <span
                  style={{
                    textAlign: "right",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {meter.serial_number || "—"}
                </span>

              </div>

            </div>

          )}

          {readings.length === 0 ? (

            <div
              style={{
                padding: "12px 0",
                color: "#6b7280",
                fontSize: 13,
              }}
            >
              No previous readings.
            </div>

          ) : (

            <div
              style={{
                maxHeight: 360,
                overflowY: "auto",
                border:
                  "1px solid #e5e7eb",
                borderRadius: 8,
              }}
            >

              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                  fontSize: 12,
                }}
              >

                <thead>

                  <tr
                    style={{
                      background: "#f3f4f6",
                    }}
                  >

                    <th
                      style={{
                        padding:
                          "8px 10px",
                        textAlign: "left",
                        fontWeight: 700,
                        color: "#374151",
                        borderBottom:
                          "1px solid #d1d5db",
                        position: "sticky",
                        top: 0,
                        background:
                          "#f3f4f6",
                      }}
                    >
                      Date
                    </th>

                    <th
                      style={{
                        padding:
                          "8px 10px",
                        textAlign: "right",
                        fontWeight: 700,
                        color: "#374151",
                        borderBottom:
                          "1px solid #d1d5db",
                        position: "sticky",
                        top: 0,
                        background:
                          "#f3f4f6",
                      }}
                    >
                      Reading (m³)
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {readings.map(
                    (
                      reading,
                      index
                    ) => (

                      <tr
                        key={reading.id}
                        style={{
                          background:
                            index % 2 === 0
                              ? "#ffffff"
                              : "#f9fafb",
                        }}
                      >

                        <td
                          style={{
                            padding:
                              "7px 10px",
                            color: "#4b5563",
                            borderBottom:
                              index ===
                              readings.length - 1
                                ? "none"
                                : "1px solid #e5e7eb",
                          }}
                        >
                          {formatDate(
                            reading.reading_date
                          )}
                        </td>

                        <td
                          style={{
                            padding:
                              "7px 10px",
                            textAlign:
                              "right",
                            fontWeight: 600,
                            color: "#111827",
                            fontVariantNumeric:
                              "tabular-nums",
                            borderBottom:
                              index ===
                              readings.length - 1
                                ? "none"
                                : "1px solid #e5e7eb",
                          }}
                        >
                          {formatReading(
                            reading.reading_value
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              marginTop: 14,
              padding: "9px 12px",
              border:
                "1px solid #d1d5db",
              borderRadius: 8,
              background: "#ffffff",
              color: "#374151",
              fontSize: 13,
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
