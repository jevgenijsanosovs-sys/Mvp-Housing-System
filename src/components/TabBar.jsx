export default function TabBar({

  tabs,

  value,

  onChange,

}) {

  return (

    <div
      style={{

        display: "flex",

        gap: 8,

        marginBottom: 24,

        flexWrap: "wrap",

      }}
    >

      {tabs.map((tab) => (

        <button

          key={tab}

          onClick={() => onChange(tab)}

          style={{

            padding: "10px 18px",

            borderRadius: 10,

            border:

              value === tab

                ? "2px solid #2563eb"

                : "1px solid #d1d5db",

            background:

              value === tab

                ? "#eff6ff"

                : "#ffffff",

            color:

              value === tab

                ? "#2563eb"

                : "#334155",

            cursor: "pointer",

            fontWeight: 600,

          }}

        >

          {tab}

        </button>

      ))}

    </div>

  );

}
