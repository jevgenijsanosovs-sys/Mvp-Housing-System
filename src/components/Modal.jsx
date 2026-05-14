import {
  modalStyle,
  modalContentStyle,
} from "../styles/theme";

export default function Modal({
  open,
  title,
  children,
  onClose,
}) {

  if (!open) {
    return null;
  }

  return (

    <div style={modalStyle}>

      <div style={modalContentStyle}>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >

          <h2
            style={{
              margin: 0,
            }}
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ×
          </button>

        </div>

        {children}

      </div>

    </div>

  );
}