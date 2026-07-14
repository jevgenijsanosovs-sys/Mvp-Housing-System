import {
  useEffect,
  useState,
} from "react";

import Modal from "./Modal";

export default function MeterHistoryModal({
  open,
  history,
  loading,
  onCorrect,
  onClose,
}) {

  const [
    correctionOpen,
    setCorrectionOpen
  ] = useState(false);

  const [
    correctedValue,
    setCorrectedValue
  ] = useState("");

  const [
    correctionReason,
    setCorrectionReason
  ] = useState("");

  const [
    isCorrecting,
    setIsCorrecting
  ] = useState(false);

  const meter =
    history?.meter || null;

  const readings =
    Array.isArray(
      history?.readings
    )
      ? history.readings
      : [];

  const latestReading =
    readings[0] || null;

  useEffect(() => {

    setCorrectionOpen(false);
    setCorrectedValue("");
    setCorrectionReason("");
    setIsCorrecting(false);

  }, [
    open,
    latestReading?.id,
  ]);

  const formatStoredReading = (
    value
  ) => {

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
      return "—";
    }

    return (
      storedValue / 1000
    )
      .toFixed(3)
      .replace(".", ",");
  };

  const calculateConsumption = (
    currentValue,
    previousValue
  ) => {

    if (
      currentValue === null ||
      currentValue === undefined ||
      previousValue === null ||
      previousValue === undefined
    ) {
      return null;
    }

    const current =
      Number(currentValue);

    const previous =
      Number(previousValue);

    if (
      !Number.isFinite(current) ||
      !Number.isFinite(previous)
    ) {
      return null;
    }

    return current - previous;
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

  const title = meter
    ? `${formatMeterType(
        meter.type
      )} History`
    : "Meter History";

  const handleOpenCorrection =
    () => {

      if (!latestReading) {
        return;
      }

      setCorrectedValue(
        formatStoredReading(
          latestReading.reading_value
        )
      );

      setCorrectionReason("");
      setCorrectionOpen(true);
    };

  const handleCancelCorrection =
    () => {

      setCorrectionOpen(false);
      setCorrectedValue("");
      setCorrectionReason("");
    };

  const handleCorrectedValueChange =
    (event) => {

      const inputValue =
        event.target.value;

      if (
        /^[0-9]*([,.][0-9]{0,3})?$/.test(
          inputValue
        )
      ) {
        setCorrectedValue(
          inputValue
        );
      }
    };

  const handleSaveCorrection =
    async () => {

      if (
        !latestReading ||
        isCorrecting
      ) {
        return;
      }

      setIsCorrecting(true);

      try {

        const success =
          await onCorrect(
            latestReading.id,
            correctedValue,
            correctionReason
          );

        if (success) {

          setCorrectionOpen(false);
          setCorrectedValue("");
          setCorrectionReason("");
        }

      } finally {

        setIsCorrecting(false);
      }
    };

  const headerCellStyle = {
    padding: "7px 5px",
    fontWeight: 700,
    color: "#374151",
    borderBottom:
      "1px solid #d1d5db",
    position: "sticky",
    top: 0,
    background: "#f3f4f6",
    lineHeight: 1.15,
    fontSize: 11,
    verticalAlign: "bottom",
  };

  const bodyCellStyle = {
    padding: "7px 5px",
    fontSize: 11,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    fontVariantNumeric:
      "tabular-nums",
  };

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
                marginBottom: 12,
                paddingBottom: 10,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >

              {meter.local_label && (

                <div
                  style={{
                    marginBottom: 6,
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
                    "auto minmax(0, 1fr)",
                  columnGap: 10,
                  rowGap: 3,
                  color: "#4b5563",
                  fontSize: 12,
                  lineHeight: 1.35,
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
                    fontSize: 11,
                    overflowWrap:
                      "anywhere",
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
                    overflowWrap:
                      "anywhere",
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
                width: "100%",
                maxHeight: 360,
                overflowY: "auto",
                overflowX: "hidden",
                border:
                  "1px solid #e5e7eb",
                borderRadius: 8,
                boxSizing:
                  "border-box",
              }}
            >

              <table
                style={{
                  width: "100%",
                  tableLayout: "fixed",
                  borderCollapse:
                    "collapse",
                }}
              >

                <colgroup>

                  <col
                    style={{
                      width: "34%",
                    }}
                  />

                  <col
                    style={{
                      width: "31%",
                    }}
                  />

                  <col
                    style={{
                      width: "35%",
                    }}
                  />

                </colgroup>

                <thead>

                  <tr>

                    <th
                      style={{
                        ...headerCellStyle,
                        textAlign: "left",
                      }}
                    >
                      Date
                    </th>

                    <th
                      style={{
                        ...headerCellStyle,
                        textAlign: "right",
                      }}
                    >
                      Reading
                      <br />
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#6b7280",
                        }}
                      >
                        (m³)
                      </span>
                    </th>

                    <th
                      style={{
                        ...headerCellStyle,
                        textAlign: "right",
                      }}
                    >
                      Consumption
                      <br />
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#6b7280",
                        }}
                      >
                        (m³)
                      </span>
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {readings.map(
                    (
                      reading,
                      index
                    ) => {

                      const previousReading =
                        readings[
                          index + 1
                        ];

                      const consumption =
                        previousReading
                          ? calculateConsumption(
                              reading.reading_value,
                              previousReading.reading_value
                            )
                          : null;

                      const isNegative =
                        consumption !== null &&
                        consumption < 0;

                      const isLastRow =
                        index ===
                        readings.length - 1;

                      const isLatest =
                        index === 0;

                      return (

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
                              ...bodyCellStyle,
                              textAlign: "left",
                              color: "#4b5563",
                              borderBottom:
                                isLastRow
                                  ? "none"
                                  : "1px solid #e5e7eb",
                            }}
                          >
                            {formatDate(
                              reading.reading_date
                            )}

                            {isLatest && (

                              <button
                                type="button"
                                onClick={
                                  handleOpenCorrection
                                }
                                style={{
                                  display: "block",
                                  marginTop: 3,
                                  padding: 0,
                                  border: "none",
                                  background:
                                    "transparent",
                                  color: "#2563eb",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                Correct
                              </button>

                            )}

                          </td>

                          <td
                            style={{
                              ...bodyCellStyle,
                              textAlign: "right",
                              fontWeight: 600,
                              color: "#111827",
                              verticalAlign: "top",
                              borderBottom:
                                isLastRow
                                  ? "none"
                                  : "1px solid #e5e7eb",
                            }}
                          >
                            {formatStoredReading(
                              reading.reading_value
                            )}
                          </td>

                          <td
                            style={{
                              ...bodyCellStyle,
                              textAlign: "right",
                              fontWeight: 600,
                              color:
                                isNegative
                                  ? "#b91c1c"
                                  : "#111827",
                              verticalAlign: "top",
                              borderBottom:
                                isLastRow
                                  ? "none"
                                  : "1px solid #e5e7eb",
                            }}
                          >
                            {consumption === null
                              ? "—"
                              : formatStoredReading(
                                  consumption
                                )}
                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

          {correctionOpen &&
            latestReading && (

            <div
              style={{
                marginTop: 12,
                padding: 12,
                border:
                  "1px solid #bfdbfe",
                borderRadius: 10,
                background: "#eff6ff",
              }}
            >

              <div
                style={{
                  marginBottom: 10,
                  color: "#1e3a8a",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Correct latest reading
              </div>

              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  color: "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Corrected reading, m³
              </label>

              <input
                type="text"
                inputMode="decimal"
                value={correctedValue}
                disabled={isCorrecting}
                onChange={
                  handleCorrectedValueChange
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: 8,
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: 14,
                  boxSizing:
                    "border-box",
                }}
              />

              <label
                style={{
                  display: "block",
                  marginTop: 9,
                  marginBottom: 4,
                  color: "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Correction reason
              </label>

              <input
                type="text"
                value={correctionReason}
                disabled={isCorrecting}
                placeholder="For example: incorrect digit entered"
                onChange={(event) =>
                  setCorrectionReason(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: 8,
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: 13,
                  boxSizing:
                    "border-box",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: 8,
                  marginTop: 10,
                }}
              >

                <button
                  type="button"
                  disabled={isCorrecting}
                  onClick={
                    handleCancelCorrection
                  }
                  style={{
                    padding: "7px 11px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius: 8,
                    background: "#ffffff",
                    color: "#374151",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor:
                      isCorrecting
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isCorrecting}
                  onClick={
                    handleSaveCorrection
                  }
                  style={{
                    padding: "7px 11px",
                    border: "none",
                    borderRadius: 8,
                    background: "#2563eb",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 700,
                    opacity:
                      isCorrecting
                        ? 0.65
                        : 1,
                    cursor:
                      isCorrecting
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isCorrecting
                    ? "Saving..."
                    : "Save correction"}
                </button>

              </div>

            </div>

          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              marginTop: 12,
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
