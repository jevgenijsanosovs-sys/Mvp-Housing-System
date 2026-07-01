import {
  actionButton,
  dangerButton,
} from "../styles/theme";

export default function ActionButton({

  text,
  icon,
  onClick,
  variant = "primary",

}) {

  const style =
    variant === "danger"
      ? dangerButton
      : actionButton;

  return (

    <button
      style={style}
      onClick={onClick}
    >

      {icon && (
        <span style={{ marginRight: 6 }}>
          {icon}
        </span>
      )}

      {text}

    </button>

  );

}
