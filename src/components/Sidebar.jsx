import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import MenuButton
  from "./MenuButton";

import LanguageSelector
  from "./LanguageSelector";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useMode,
} from "../context/ModeContext";

import {
  useTranslation,
} from "../i18n";

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
  "/announcements",
  "/settings",
]);

const ADMIN_PATHS = new Set([
  "/",
  "/users",
  "/apartments",
  "/water-meters",
  "/water-readings",
  "/monthly-report",
  "/admin-announcements",
  "/settings",
]);

const SETTINGS_LABELS = {
  lv: "Iestatījumi",
  en: "Settings",
  ru: "Настройки",
};

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

  const {
    t,
    language,
  } = useTranslation();

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

  const settingsLabel =
    SETTINGS_LABELS[language] ||
    SETTINGS_LABELS.en;

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
          {t("sidebar.user")}:{" "}
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
              {t(
                "sidebar.residentMode"
              )}
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
              {t(
                "sidebar.adminMode"
              )}
            </button>
          )}
        </div>

        <hr style={divider} />

        {mode === "resident" && (
          <>
            <MenuButton
              title={t(
                "sidebar.dashboard"
              )}
              onClick={() =>
                go("/")
              }
            />

            <MenuButton
              title={t(
                "sidebar.waterMeters"
              )}
              onClick={() =>
                go("/water")
              }
            />

            <MenuButton
              title={t(
                "sidebar.announcements"
              )}
              onClick={() =>
                go(
                  "/announcements"
                )
              }
            />
          </>
        )}

        {mode === "admin" && (
          <>
            <MenuButton
              title={t(
                "sidebar.dashboard"
              )}
              onClick={() =>
                go("/")
              }
            />

            <MenuButton
              title={t(
                "sidebar.users"
              )}
              onClick={() =>
                go("/users")
              }
            />

            <MenuButton
              title={t(
                "sidebar.apartments"
              )}
              onClick={() =>
                go("/apartments")
              }
            />

            <MenuButton
              title={t(
                "sidebar.waterMeterManagement"
              )}
              onClick={() =>
                go("/water-meters")
              }
            />

            <MenuButton
              title={t(
                "sidebar.waterReadingHistory"
              )}
              onClick={() =>
                go("/water-readings")
              }
            />

            <MenuButton
              title={t(
                "sidebar.announcements"
              )}
              onClick={() =>
                go(
                  "/admin-announcements"
                )
              }
            />

            <MenuButton
              title={t(
                "sidebar.monthlyReport"
              )}
              onClick={() =>
                go("/monthly-report")
              }
            />
          </>
        )}

        <hr style={divider} />

        <MenuButton
          title={
            settingsLabel
          }
          onClick={() =>
            go("/settings")
          }
        />
      </div>

      <div
        style={{
          marginTop: "auto",
        }}
      >
        <hr style={divider} />

        {!isMobile && (
          <LanguageSelector
            variant="sidebar"
            style={{
              marginBottom: 14,
            }}
          />
        )}

        <button
          onClick={logout}
          style={buttonStyle}
        >
          {t(
            "sidebar.logout"
          )}
        </button>
      </div>
    </div>
  );
}
