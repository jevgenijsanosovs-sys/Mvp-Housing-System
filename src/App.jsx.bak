import { useState } from "react";

import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import MenuButton from "./components/MenuButton";

import {
  useAuth,
} from "./context/AuthContext";

import {
  layout,
  sidebar,
  inputStyle,
  buttonStyle,
  menuButton,
  activeButton,
  divider,
  sidebarTitle,
  sidebarUser,
  modeBlock,
  content,
  loginPage,
  loginCard,
} from "./styles/theme";

export default function App() {

  const {
    token,
    me,
    login,
    logout,
    loading,
  } = useAuth();

  const navigate = useNavigate();

  // =====================================
  // LOGIN FORM
  // =====================================

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  // =====================================
  // UI
  // =====================================

  const [mode, setMode] =
    useState("resident");

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div>
        Loading...
      </div>
    );

  }

  // =====================================
  // LOGIN SCREEN
  // =====================================

  if (!token || !me) {

    return (

      <div style={loginPage}>

        <div style={loginCard}>

          <h1 style={{ lineHeight: "1.0" }}>
            DžIKS IRLAVA 20
            <br />
            MVP Housing System
          </h1>

          <p>
            Residential Management Platform
          </p>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={() =>
              login(email, password)
            }
            style={buttonStyle}
          >
            Login
          </button>

        </div>

      </div>

    );
  }

  // =====================================
  // ROLES
  // =====================================

  const roles = me.roles || [];

  const hasResident =
    roles.includes("resident") ||
    roles.includes("owner");

  const hasAdmin =
    roles.includes("admin");

  // =====================================
  // APP LAYOUT
  // =====================================

  return (

    <div style={layout}>

      {/* SIDEBAR */}

      <div style={sidebar}>

        <h2 style={sidebarTitle}>
          MVX System
        </h2>

        <div style={sidebarUser}>
          {me.user.first_name}
          {" "}
          {me.user.last_name}
        </div>

        {/* MODES */}

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

        {/* RESIDENT MENU */}

        {mode === "resident" && (

          <>

            <MenuButton
              title="Dashboard"
              onClick={() =>
                navigate("/")
              }
            />

            <MenuButton
              title="Water Meters"
              onClick={() =>
                navigate("/water")
              }
            />

          </>

        )}

        {/* ADMIN MENU */}

        {mode === "admin" && (

          <>

            <MenuButton
              title="Dashboard"
              onClick={() =>
                navigate("/")
              }
            />

            <MenuButton
              title="Users"
              onClick={() =>
                navigate("/users")
              }
            />

            <MenuButton
              title="Apartments"
              onClick={() =>
                navigate("/apartments")
              }
            />

            <MenuButton
              title="Water Readings"
              onClick={() =>
                navigate("/water-admin")
              }
            />

          </>

        )}

        <div style={{ flex: 1 }} />

        <hr style={divider} />

        <button
          onClick={logout}
          style={buttonStyle}
        >
          Logout
        </button>

      </div>

      {/* PAGE CONTENT */}

      <div style={content}>

        <Outlet />

      </div>

    </div>

  );
}