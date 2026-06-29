export default function PageHeader({

  title,

  children,

}) {

  return (

    <div
      style={{

        position: "sticky",

        top: 0,

        zIndex: 100,

        background: "white",

        paddingBottom: 16,

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

          gap: 12,

        }}
      >

        <h1
          style={{
            margin: 0,
          }}
        >
          {title}
        </h1>

        <div
          style={{

            display: "flex",

            gap: 10,

            flexWrap: "wrap",

          }}
        >

          {children}

        </div>

      </div>

    </div>

  );

}
