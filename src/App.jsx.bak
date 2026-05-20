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

const {
  apartments,
  showCreateApartment,
  setShowCreateApartment,
  newApartment,
  setNewApartment,
  loadApartments,
  createApartment,
} = useApartments();

export default function App() {

  const {
    token,
    me,
    login,
    logout,
    loading,
  } = useAuth();

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
  // AUTH
  // =====================================

  //---MOVED TO "./context/AuthContext"---

  // =====================================
  // LOGIN
  // =====================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================
  // UI
  // =====================================

  const [mode, setMode] = useState("resident");

  const [screen, setScreen] =
    useState("dashboard");

  // =====================================
  // DATA
  // =====================================

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [waterMeters, setWaterMeters] =
    useState([]);

  const [adminWater, setAdminWater] =
    useState([]);

  const [dashboard, setDashboard] =
    useState(null);

  // =========================
  // CRUD FUNCTIONS
  // =========================

  // =====================================
  // LOAD USER
  // =====================================

  //-----------MOVED TO ....--------------

  // =====================================
  // LOADERS
  // =====================================

  const loadMyWater = async () => {

    const d = await api(
      "/api/my-water-meters"
    );

    setWaterMeters(
      Array.isArray(d) ? d : []
    );
  };

  const loadAdminWater = async () => {

    const d = await api(
      "/api/admin/water-readings"
    );

    setAdminWater(
      Array.isArray(d) ? d : []
    );
  };

  const loadDashboard = async () => {

    const d = await api(
      "/api/admin/dashboard"
    );

    setDashboard(d);
  };

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
  // LOGIN
  // =====================================

  // ----------MOVED TO ...---------------

  // =====================================
  // LOGOUT
  // =====================================

  // ----------MOVED TO ...---------------

  // =====================================
  // SUBMIT WATER
  // =====================================

  const submitReading = async (
    meterId,
    value
  ) => {

    if (!value) {
      alert("Enter value");
      return;
    }

    const r = await api(
      "/api/submit-water-reading",
      {
        method: "POST",

        body: JSON.stringify({
          meter_id: meterId,
          reading_value: Number(value),
        }),
      }
    );

    if (r.ok) {

      alert("Submitted");

      loadMyWater();

    } else {

      alert(
        r?.error || "Submit failed"
      );

    }
  };

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
                setScreen("dashboard")
              }
            />

            <MenuButton
              title="Water Meters"
              onClick={() =>
                setScreen("water")
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
                setScreen("dashboard")
              }
            />

            <MenuButton
              title="Users"
              onClick={() =>
                setScreen("users")
              }
            />

            <MenuButton
              title="Apartments"
              onClick={() =>
                setScreen("apartments")
              }
            />

            <MenuButton
              title="Water Readings"
              onClick={() =>
                setScreen("water-admin")
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

{screen === "dashboard" && (

  <DashboardScreen
    mode={mode}
    dashboard={dashboard}
  />

)}

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
// COMPONENTS
// =====================================
// ----MOVED TO compnents---------------
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
