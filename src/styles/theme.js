const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#f3f4f6",
};

const sidebar = {
  width: 260,
  background: "#111827",
  color: "white",
  padding: 20,

  display: "flex",
  flexDirection: "column",

  height: "100vh",
  position: "sticky",
  top: 0,

  overflow: "hidden",
  boxSizing: "border-box",
};

const sidebarTitle = {
  color: "white",
};

const sidebarUser = {
  color: "#d1d5db",
  marginBottom: 20,
};

const divider = {
  borderColor: "#374151",
  width: "100%",
};

const modeBlock = {
  marginBottom: 20,
};

const content = {
  flex: 1,
  padding: 30,
};

const loginPage = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f3f4f6",
  padding: 20,
};

const loginCard = {
  background: "white",
  padding: 30,
  borderRadius: 20,
  width: "100%",
  maxWidth: 420,
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  borderRadius: 10,
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const buttonStyle = {
  marginTop: 20,
  padding: 12,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  width: "100%",
};

const menuButton = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const activeButton = {
  ...menuButton,
  background: "#2563eb",
  color: "white",
};

const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 20,
  marginBottom: 20,
};

const labelStyle = {
  textAlign: "right",
  paddingRight: 20,
  fontWeight: "bold",
};

const tableStyle = {
  width: "100%",
  background: "white",
  borderCollapse: "collapse",
};

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
};

const dashboardCard = {
  background: "white",
  borderRadius: 20,
  padding: 28,
  border: "1px solid #e5e7eb",

  boxShadow:
    "0 10px 25px rgba(0,0,0,0.05)",

  transition: "all 0.2s ease",

  minHeight: 130,

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const modalStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalContentStyle = {
  background: "white",
  padding: 30,
  borderRadius: 20,
  width: "100%",
  maxWidth: 500,
};

export {
  layout,
  sidebar,
  sidebarTitle,
  sidebarUser,
  divider,
  modeBlock,
  content,
  loginPage,
  loginCard,
  inputStyle,
  buttonStyle,
  menuButton,
  activeButton,
  cardStyle,
  labelStyle,
  tableStyle,
  dashboardGrid,
  dashboardCard,
  modalStyle,
  modalContentStyle,
};

// ======================================
// PAGE HEADER
// ======================================

export const pageHeader = {

  position: "sticky",

  top: 0,

  zIndex: 100,

  background: "inherit",

  paddingBottom: 16,

  marginBottom: 20,

};

export const pageHeaderRow = {

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  gap: 16,

  flexWrap: "wrap",

};

export const pageHeaderButtons = {

  display: "flex",

  gap: 10,

  flexWrap: "wrap",

};

// ======================================
// ACTION BUTTON
// ======================================

export const actionButton = {

  height: 42,

  padding: "0 18px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: 8,

  border: "none",

  borderRadius: 10,

  cursor: "pointer",

  background: "#2563eb",

  color: "#fff",

  fontWeight: 600,

  fontSize: 14,

  transition: "0.15s",

};

export const dangerButton = {

  ...actionButton,

  background: "#dc2626",

};

// ========================================
// MODERN TABLE
// ========================================

export const modernTable = {

  width: "100%",

  borderCollapse: "separate",

  borderSpacing: 0,

  background: "#ffffff",

  borderRadius: 16,

  overflow: "hidden",

  boxShadow:
    "0 6px 24px rgba(15,23,42,.08)",

};

export const modernTh = {

  background: "#f8fafc",

  padding: "18px 20px",

  textAlign: "left",

  color: "#475569",

  fontWeight: 700,

  fontSize: 14,

  letterSpacing: ".03em",

  borderBottom:
    "1px solid #e5e7eb",

};

export const modernTd = {

  padding: "18px 20px",

  fontSize: 15,

  color: "#334155",

  borderBottom:
    "1px solid #f1f5f9",

};

export const statusActive = {

  display: "inline-block",

  padding: "6px 14px",

  borderRadius: 999,

  background: "#dcfce7",

  color: "#15803d",

  fontWeight: 600,

  fontSize: 14,

};

export const statusInactive = {

  display: "inline-block",

  padding: "6px 14px",

  borderRadius: 999,

  background: "#f3f4f6",

  color: "#6b7280",

  fontWeight: 600,

  fontSize: 14,

};

export const tableContainer = {

  background: "#fff",

  borderRadius: 18,

  overflow: "hidden",

  border: "1px solid #e5e7eb",

  boxShadow:
    "0 8px 30px rgba(15,23,42,.06)",

  marginTop: 20,

};


