import { api } from "./services/api";

import { useEffect, useState } from "react";
import MenuButton from "./components/MenuButton";

import UsersScreen from "./screens/UsersScreen";
import ApartmentsScreen from "./screens/ApartmentsScreen";
import ResidentWaterScreen from "./screens/ResidentWaterScreen";
import AdminWaterScreen from "./screens/AdminWaterScreen";
import DashboardScreen from "./screens/DashboardScreen";

import {
  useAuth,
} from "./context/AuthContext";

import {
  useUsers,
} from "./hooks/useUsers";

import useApartments from "./hooks/useApartments";

import useWater from "./hooks/useWater";

import useDashboard from "./hooks/useDashboard";

import {
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

const {
  apartments,
  showCreateApartment,
  setShowCreateApartment,
  newApartment,
  setNewApartment,
  loadApartments,
  createApartment,
} = useApartments();

const {
  waterMeters,
  adminWater,
  loadMyWater,
  loadAdminWater,
  submitReading,
} = useWater();

const {
  dashboard,
  loadDashboard,
} = useDashboard();

export default function App() {

  const {
    token,
    me,
    login,
    logout,
    loading,
  } = useAuth();
  
  const navigate = useNavigate();

  const location = useLocation();
  
  const screen =
    location.pathname === "/"
      ? "dashboard"
      : location.pathname.replace("/", "");

	const {
	  users,
	  loadUsers,
	
	  assignmentUser,
	  setAssignmentUser,
	
	  assignmentApartmentId,
	  setAssignmentApartmentId,
	
	  assignmentRelation,
	  setAssignmentRelation,
	
	  userAssignments,
	  setUserAssignments,
	
	  showCreateUser,
	  setShowCreateUser,
	
	  newUser,
	  setNewUser,
	
	  createUser,
	
	  loadUserAssignments,
	
	  addAssignment,
	
	  removeAssignment,
	} = useUsers();


  // =====================================
  // LOGIN
  // =====================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================
  // UI
  // =====================================

  const [mode, setMode] = useState("resident");

  // =====================================
  // SCREEN LOADERS
  // =====================================

  useEffect(() => {

    if (screen === "users") {
      loadUsers();
    }

    if (screen === "apartments") {
      loadApartments();
    }

    if (screen === "water") {
      loadMyWater();
    }

    if (screen === "water-admin") {
      loadAdminWater();
    }

    if (
      screen === "dashboard" &&
      mode === "admin"
    ) {
      loadDashboard();
    }

  }, [screen, mode]);

  // =====================================
  // LOGIN SCREEN
  // =====================================

	if (loading) {

	  return (
		<div>
		  Loading...
		</div>
	  );

	}

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
  // MAIN APP
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

        {/* RESIDENT */}

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

            <MenuButton
              title="Invoices"
              onClick={() =>
                setScreen("invoices")
              }
            />

            <MenuButton
              title="Tickets"
              onClick={() =>
                setScreen("tickets")
              }
            />

            <MenuButton
              title="Chat"
              onClick={() =>
                setScreen("chat")
              }
            />

          </>
        )}

        {/* ADMIN */}

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
                navigare("/water-admin")
              }
            />

            <MenuButton
              title="Tickets"
              onClick={() =>
                setScreen("tickets-admin")
              }
            />

            <MenuButton
              title="Workers"
              onClick={() =>
                setScreen("workers")
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

      {/* CONTENT */}

      <div style={content}>


        {/* DASHBOARD */}


{screen === "users" && (

  <UsersScreen
    users={users}
    loadApartments={loadApartments}
    setAssignmentUser={setAssignmentUser}
    loadUserAssignments={loadUserAssignments}
    showCreateUser={showCreateUser}
    setShowCreateUser={setShowCreateUser}
    newUser={newUser}
    setNewUser={setNewUser}
    createUser={createUser}
    assignmentUser={assignmentUser}
    assignmentApartmentId={assignmentApartmentId}
    setAssignmentApartmentId={
      setAssignmentApartmentId
    }
    apartments={apartments}
    assignmentRelation={assignmentRelation}
    setAssignmentRelation={
      setAssignmentRelation
    }
    addAssignment={addAssignment}
    setUserAssignments={
      setUserAssignments
    }
    userAssignments={userAssignments}
    removeAssignment={removeAssignment}
  />

)}

{screen === "apartments" && (

  <ApartmentsScreen
    apartments={apartments}
    showCreateApartment={
      showCreateApartment
    }
    setShowCreateApartment={
      setShowCreateApartment
    }
    newApartment={newApartment}
    setNewApartment={setNewApartment}
    createApartment={createApartment}
  />

)}



        {/* RESIDENT WATER */}

{screen === "water" && (

  <ResidentWaterScreen
    waterMeters={waterMeters}
    submitReading={submitReading}
  />

)}

        {/* ADMIN WATER */}

{screen === "water-admin" && (

  <AdminWaterScreen
    adminWater={adminWater}
  />

)}

      </div>

    </div>
  );
}

// =====================================
// STYLES
// =====================================

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
