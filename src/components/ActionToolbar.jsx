export default function ActionToolbar({

  children,

  justify = "flex-start",

  wrap = true,

}) {

  return (

    <div

      style={{

        display: "flex",

        alignItems: "center",

        justifyContent: justify,

        gap: 10,

        flexWrap: wrap

          ? "wrap"

          : "nowrap",

        marginBottom: 16,

      }}

    >

      {children}

    </div>

  );

}
