import { labelStyle } from "../styles/theme";

export default function InfoRow({
  label,
  value,
}) {
  return (
    <tr>
      <td style={labelStyle}>
        {label}:
      </td>

      <td>
        {value}
      </td>
    </tr>
  );
}