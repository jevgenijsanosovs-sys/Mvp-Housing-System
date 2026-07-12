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

  return (
    <div style={cardStyle}>

      <h3>
        Apartment #
        {meter.apartment_number}
      </h3>

      <p>
        Type:
        {" "}
        {meter.type}
      </p>

      <p>
        Serial:
        {" "}
        {meter.serial_number}
      </p>

      <p>
        Last Reading:
        {" "}
        {meter.last_reading}
      </p>

      <p>
        Last Date:
        {" "}
        {meter.last_date}
      </p>

      <input
        type="number"
        min="0"
        step="0.001"
        inputMode="decimal"
        placeholder="New reading"
        value={value}
        disabled={isSubmitting}
        onChange={(e) =>
          setValue(e.target.value)
        }
        style={inputStyle}
      />

      <button
        type="button"
        style={{
          ...buttonStyle,

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
          : "Submit"}
      </button>

    </div>
  );
}
