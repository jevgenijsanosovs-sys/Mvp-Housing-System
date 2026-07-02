export default function Badge({

  color = "gray",

  children,

}) {

  const colors = {

    green: {
      background: "#dcfce7",
      color: "#15803d",
    },

    gray: {
      background: "#f3f4f6",
      color: "#6b7280",
    },

    blue: {
      background: "#dbeafe",
      color: "#2563eb",
    },

    red: {
      background: "#fee2e2",
      color: "#dc2626",
    },

  };

  return (

    <span

      style={{

        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        padding: "6px 14px",

        borderRadius: 999,

        fontSize: 13,

        fontWeight: 600,

        ...colors[color],

      }}

    >

      {children}

    </span>

  );

}
