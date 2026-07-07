export default function SectionCard({

  title,

  children,

}) {

  return (

    <div

      style={{

        background: "#ffffff",

        border: "1px solid #e5e7eb",

        borderRadius: 16,

        padding: 20,

        marginBottom: 20,

      }}

    >

      {title && (

        <div

          style={{

            fontSize: 17,

            fontWeight: 700,

            color: "#334155",

            marginBottom: 18,

          }}

        >

          {title}

        </div>

      )}

      {children}

    </div>

  );

}
