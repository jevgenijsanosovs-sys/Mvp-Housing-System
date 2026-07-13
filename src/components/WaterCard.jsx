import { useState } from "react";

import {
  inputStyle,
  buttonStyle,
} from "../styles/theme";

export default function WaterCard({
  meter,
  onSubmit,
}) {

  const [value, setValue] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting
  ] = useState(false);

  const formatValue = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    return value;
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

      if (!type) {
        return "Water";
      }

      const normalizedType =
        String(type)
          .trim()
          .toLowerCase();

      if (normalizedType === "cold") {
        return "Cold Water";
      }

      if (normalizedType === "hot") {
        return "Hot Water";
      }

      return `${type} Water`;
    };

  const normalizedMeterType =
    String(
      meter.type || ""
    )
      .trim()
      .toLowerCase();

  const isHotWater =
    normalizedMeterType === "hot";

  const handleSubmit =
    async () => {

      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);

      try {

        const success =
          await onSubmit(
            meter.id,
            value
          );

        if (success) {
          setValue("");
        }

      } finally {

        setIsSubmitting(false);
      }
    };

  const rowStyle = {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: 12,
    padding: "5px 0",
  };

  const labelStyle = {
    color: "#6b7280",
    fontSize: 13,
  };

  const valueStyle = {
    fontWeight: 600,
    textAlign: "right",
    color: "#111827",
    fontSize: 14,
  };

  return (
    <div
      style={{
        padding: 14,
        border:
          "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#f9fafb",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 10,
        }}
      >

        <div>

          <h3
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.25,
            }}
          >
            {formatMeterType(
              meter.type
            )}
          </h3>

          {meter.local_label && (

            <div
              style={{
                marginTop: 2,
                color: "#4b5563",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {meter.local_label}
            </div>

          )}

        </div>

        <span
          style={{
            padding: "4px 9px",
            borderRadius: 999,
            background:
              isHotWater
                ? "#fff7ed"
                : "#eff6ff",
            color:
              isHotWater
                ? "#c2410c"
                : "#1d4ed8",
            fontSize: 11,
            fontWeight: 700,
            textTransform:
              "capitalize",
            whiteSpace: "nowrap",
          }}
        >
          {formatValue(
            meter.type
          )}
        </span>

      </div>

      <div
        style={{
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom:
            "1px solid #e5e7eb",
        }}
      >

        <div style={rowStyle}>

          <span style={labelStyle}>
            Riser
          </span>

          <span
            style={{
              ...valueStyle,
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 12,
            }}
          >
            {formatValue(
              meter.riser_code
            )}
          </span>

        </div>

        <div style={rowStyle}>

          <span style={labelStyle}>
            Serial number
          </span>

          <span style={valueStyle}>
            {formatValue(
              meter.serial_number
            )}
          </span>

        </div>

        <div style={rowStyle}>

          <span style={labelStyle}>
            Current reading
          </span>

          <span
            style={{
              ...valueStyle,
              fontSize: 18,
            }}
          >
            {formatValue(
              meter.last_reading
            )}
          </span>

        </div>

        <div style={rowStyle}>

          <span style={labelStyle}>
            Last submitted
          </span>

          <span style={valueStyle}>
            {formatDate(
              meter.last_date
            )}
          </span>

        </div>

      </div>

      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 14,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        New reading
      </label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) auto",
          gap: 8,
          alignItems: "stretch",
        }}
      >

        <input
          type="number"
          min="0"
          step="0.001"
          inputMode="decimal"
          placeholder="Enter value"
          value={value}
          disabled={isSubmitting}
          onChange={(e) =>
            setValue(e.target.value)
          }
          style={{
            ...inputStyle,
            width: "100%",
            margin: 0,
            boxSizing:
              "border-box",
          }}
        />

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          style={{
            ...buttonStyle,
            minWidth: 120,
            margin: 0,
            opacity:
              isSubmitting
                ? 0.65
                : 1,
            cursor:
              isSubmitting
                ? "not-allowed"
                : "pointer",
          }}
        >
          {isSubmitting
            ? "Submitting..."
            : "Submit"}
        </button>

      </div>

    </div>
  );
}
