import { useState } from "react";

import {
  cardStyle,
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
    gap: 16,
    padding: "8px 0",
    borderBottom:
      "1px solid #e5e7eb",
  };

  const labelStyle = {
    color: "#6b7280",
  };

  const valueStyle = {
    fontWeight: 600,
    textAlign: "right",
  };

  return (
    <div style={cardStyle}>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
        }}
      >

        <h3
          style={{
            margin: 0,
          }}
        >
          Apartment #
          {formatValue(
            meter.apartment_number
          )}
        </h3>

        <span
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            background: "#eff6ff",
            color: "#1d4ed8",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {formatValue(
            meter.type
          )}
        </span>

      </div>

      <div
        style={{
          marginBottom: 20,
        }}
      >

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
              color: "#111827",
            }}
          >
            {formatValue(
              meter.last_reading
            )}
          </span>

        </div>

        <div
          style={{
            ...rowStyle,
            borderBottom: "none",
          }}
        >

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

      <div
        style={{
          paddingTop: 16,
          borderTop:
            "1px solid #e5e7eb",
        }}
      >

        <label
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          New reading
        </label>

        <input
          type="number"
          min="0"
          step="0.001"
          inputMode="decimal"
          placeholder="Enter current value"
          value={value}
          disabled={isSubmitting}
          onChange={(e) =>
            setValue(e.target.value)
          }
          style={{
            ...inputStyle,
            width: "100%",
            boxSizing:
              "border-box",
            marginBottom: 10,
          }}
        />

        <div
          style={{
            marginBottom: 12,
            color: "#6b7280",
            fontSize: 13,
            lineHeight: 1.4,
          }}
        >
          Enter the value currently
          shown on the meter.
        </div>

        <button
          type="button"
          style={{
            ...buttonStyle,
            width: "100%",

            opacity:
              isSubmitting
                ? 0.65
                : 1,

            cursor:
              isSubmitting
                ? "not-allowed"
                : "pointer",
          }}
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting
            ? "Submitting..."
            : "Submit reading"}
        </button>

      </div>

    </div>
  );
}
