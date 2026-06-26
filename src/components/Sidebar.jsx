import {
  useNavigate,
} from "react-router-dom";

import MenuButton from "./MenuButton";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useMode,
} from "../context/ModeContext";

import {
  sidebar,
  buttonStyle,
  menuButton,
  activeButton,
  divider,
  sidebarTitle,
  sidebarUser,
  modeBlock,
} from "../styles/theme";

export default function Sidebar({
  isMobile = false,
  sidebarOpen = false,
  setSidebarOpen = () => {},
}) {
  const {
    me,
    logout,
  } = useAuth();

  const {
    mode,
    setMode,
  } = useMode();

  const navigate =
    useNavigate();

  if (!me) {
    return null;
  }

  const roles =
    me?.roles || [];

  const hasResident =
    roles.includes("resident") ||
    roles.includes("owner");

  const hasAdmin =
    roles.includes("admin");

  const go = (path) => {
    navigate(path);

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const sidebarStyle = {
    ...sidebar,

    ...(isMobile
      ? {
          position: "fixed",
          top: 0,
          left: sidebarOpen
            ? 0
            : -320,

          height: "100vh",
          overflowY: "auto",

          zIndex: 1800,

          transition:
            "left 0.25s ease",
        }
      : {
          height: "100vh",
          overflow: "hidden",
        }),
  };

  return (
    <div style={sidebarStyle}>
      <div>
        <h2 style={sidebarTitle}>
          <div style={{ fontSize: "0.8em" }}>
            MVX Housing System
          </div>
          <div>DzĪKS IRLAVA 20</div>
        </h2>

        <div style={sidebarUser}>
          User:{" "}
          {me?.user?.first_name}{" "}
          {me?.user?.last_name}
        </div>

        <div style={modeBlock}>
          {hasResident && (
            <button
              style={
                mode === "resident"
                  ? activeButton
                  : menuButton
              }
              onClick={() =>
                setMode("resident")
              }
            >
              Resident Mode
            </button>
          )}

          {hasAdmin && (
            <button
              style={
                mode === "admin"
                  ? activeButton
                  : menuButton
              }
              onClick={() =>
                setMode("admin")
              }
            >
              Admin Mode
            </button>
          )}
        </div>

        <hr style={divider} />

        {mode === "resident" && (
          <>
            <MenuButton
              title="Dashboard"
              onClick={() =>
                go("/")
              }
            />

            <MenuButton
              title="Water Meters"
              onClick={() =>
                go("/water")
              }
            />
          </>
        )}

        {mode === "admin" && (
          <>
            <MenuButton
              title="Dashboard"
              onClick={() =>
                go("/")
              }
            />

            <MenuButton
              title="Users"
              onClick={() =>
                go("/users")
              }
            />

            <MenuButton
              title="Apartments"
              onClick={() =>
                go("/apartments")
              }
            />

            <MenuButton
              title="Water Readings"
              onClick={() =>
                go("/water-admin")
              }
            />

            <MenuButton
              title="Water Meters"
              onClick={() =>
                go("/water-meters")
              }
            />
            
          </>
        )}
      </div>

      <div
        style={{
          marginTop: "auto",
        }}
      >
        <hr style={divider} />

        <button
          onClick={logout}
          style={buttonStyle}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
