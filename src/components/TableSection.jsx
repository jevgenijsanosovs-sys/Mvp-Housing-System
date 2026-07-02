export default function TableSection({ children }) {

  return (

    <div
      style={{

        background: "#ffffff",

        border: "1px solid #e5e7eb",

        borderRadius: 18,

        overflow: "hidden",

        boxShadow:
          "0 8px 24px rgba(15,23,42,.06)",

      }}
    >

      {children}

    </div>

  );

}
