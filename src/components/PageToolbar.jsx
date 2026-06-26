export default function PageToolbar({

  title,

  children,

}) {

  return (

    <div
      style={{

        position: "sticky",

        top: 0,

        zIndex: 20,

        background: "var(--page-bg, white)",

        paddingBottom: 12,

        marginBottom: 20,

      }}
    >

      <div
        style={{

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: 10,

        }}
      >

        <h2
          style={{
            margin: 0,
          }}
        >
          {title}
        </h2>

        <div
          style={{

            display: "flex",

            gap: 8,

            flexWrap: "wrap",

          }}
        >

          {children}

        </div>

      </div>

    </div>

  );

}
