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
        placeholder="New reading"
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        style={inputStyle}
      />

      <button
        style={buttonStyle}
        onClick={() =>
          onSubmit(meter.id, value)
        }
      >
        Submit
      </button>

    </div>
  );
}