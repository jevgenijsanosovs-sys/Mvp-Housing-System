export default function PageHeader({

  title,

  subtitle,

  children,

}) {

  return (

    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "inherit",
        paddingBottom: 16,
        marginBottom: 20,
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,
            }}
          >
            {title}
          </h1>

          {subtitle && (

            <div
              style={{
                marginTop: 4,
                fontSize: "0.9rem",
                color: "#666",
              }}
            >
              {subtitle}
            </div>

          )}

        </div>

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
