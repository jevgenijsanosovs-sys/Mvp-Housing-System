export default function StatusBadge({

  active,

  activeText = "Active",

  inactiveText = "Inactive",

}) {

  return (

    <span

      style={{

        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        minWidth: 88,

        padding: "5px 12px",

        borderRadius: 999,

        fontSize: 12,

        fontWeight: 600,

        background: active

          ? "#dcfce7"

          : "#f3f4f6",

        color: active

          ? "#15803d"

          : "#6b7280",

      }}

    >

      {active

        ? activeText

        : inactiveText}

    </span>

  );

}
