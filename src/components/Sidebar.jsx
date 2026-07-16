import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import MenuButton
  from "./MenuButton";

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

const LAST_PATH_KEYS = {
  resident:
    "mvx:last-path:resident",

  admin:
    "mvx:last-path:admin",
};

const DEFAULT_PATHS = {
  resident: "/",
  admin: "/",
};

const RESIDENT_PATHS = new Set([
  "/",
  "/water",
]);

const ADMIN_PATHS = new Set([
  "/",
  "/users",
  "/apartments",
  "/water-meters",
  "/water-readings",
  "/monthly-report",
]);

function isPathAllowedForMode(
  path,
  mode
) {

  if (mode === "resident") {

    return RESIDENT_PATHS.has(
      path
    );
  }

  if (mode === "admin") {

    return ADMIN_PATHS.has(
      path
    );
  }

  return false;
}

function saveLastPath(
  mode,
  path
) {

  const key =
    LAST_PATH_KEYS[mode];

  if (
    !key ||
    !isPathAllowedForMode(
      path,
      mode
    )
  ) {
    return;
  }

  sessionStorage.setItem(
    key,
    path
  );
}

function getLastPath(
  mode
) {

  const key =
    LAST_PATH_KEYS[mode];

  const storedPath =
    key
      ? sessionStorage.getItem(
          key
        )
      : null;

  if (
    storedPath &&
    isPathAllowedForMode(
      storedPath,
      mode
    )
  ) {
    return storedPath;
  }

  return (
    DEFAULT_PATHS[mode] ||
    "/"
  );
}

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

  const location =
    useLocation();

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

  const closeMobileSidebar =
    () => {

      if (isMobile) {

        setSidebarOpen(false);
      }
    };

  const go = (
    path
  ) => {

    saveLastPath(
      mode,
      path
    );

    navigate(path);

    closeMobileSidebar();
  };

  const switchMode = (
    nextMode
  ) => {

    if (
      nextMode === mode
    ) {

      closeMobileSidebar();

      return;
    }

    saveLastPath(
      mode,
      location.pathname
    );

    const targetPath =
      getLastPath(
        nextMode
      );

    setMode(
      nextMode
    );

    navigate(
      targetPath
    );

    closeMobileSidebar();
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

          <div
            style={{
              fontSize: "0.8em",
            }}
          >
            MVX System
          </div>

          <div>
            DzĪKS IRLAVA 20
          </div>

        </h2>

        <div style={sidebarUser}>

          User:{" "}
          {me?.user?.first_name}
          {" "}
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
                switchMode(
                  "resident"
                )
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
                switchMode(
                  "admin"
                )
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
              title="Water Meter Management"
              onClick={() =>
                go("/water-meters")
              }
            />

            <MenuButton
              title="Water Reading History"
              onClick={() =>
                go("/water-readings")
              }
            />

            <MenuButton
              title="Monthly Report"
              onClick={() =>
                go("/monthly-report")
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
