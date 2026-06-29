export default function ActionButton({

  text,

  icon,

  onClick,

  variant = "primary",

}) {

  const style = {

    padding: "10px 16px",

    borderRadius: 8,

    border: "none",

    cursor: "pointer",

    fontWeight: 600,

    whiteSpace: "nowrap",

    background:
      variant === "danger"
        ? "#dc2626"
        : "#2563eb",

    color: "white",

  };

  return (

    <button
      style={style}
      onClick={onClick}
    >

      {icon} {text}

    </button>

  );

}
