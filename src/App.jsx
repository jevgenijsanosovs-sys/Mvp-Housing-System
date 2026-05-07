import { useEffect, useState } from "react";

const API =
  "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {

  // =========================
  // AUTH
  // =========================

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [me, setMe] = useState(null);

  // =========================
  // LOGIN FORM
  // =========================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // UI
  // =========================

  const [mode, setMode] = useState("resident");
  const [screen, setScreen] = useState("dashboard");

  // =========================
  // DATA
  // =========================

  const [apartments, setApartments] = useState([]);
  const [users, setUsers] = useState([]);

  // =========================
  // API
  // =========================

  const api = async (url, options = {}) => {

    const res = await fetch(API + url, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        Authorization:
          token
            ? "Bearer " + token
            : "",

        ...(options.headers || {}),
      },
    });

    return await res.json();
  };

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {

    if (!token) return;

    api("/api/me")
      .then((d) => {

        if (d?.user) {

          setMe(d);

          const hasResident =
            d.roles?.includes("resident") ||
            d.roles?.includes("owner");

          const hasAdmin =
            d.roles?.includes("admin");

          if (hasAdmin && !hasResident) {
            setMode("admin");
          }

          if (hasResident) {
            setMode("resident");
          }

        } else {

          logout();

        }

      });

  }, [token]);

  // =========================
  // LOGIN
  // =========================

  const login = async () => {

    const res = await api("/api/login", {
      method: "POST",

      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (res.token) {

      localStorage.setItem(
        "token",
        res.token
      );

      setToken(res.token);

    } else {

      alert(
        res?.error || "Login failed"
      );

    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);

    setMe(null);

    setScreen("dashboard");

  };

  // =========================
  // LOADERS
  // =========================

  const loadApartments = async () => {

    const d = await api(
      "/api/apartments/full"
    );

    setApartments(d || []);

  };

  const loadUsers = async () => {

    const d = await api(
      "/api/admin/users"
    );

    setUsers(d || []);

  };

  useEffect(() => {

    if (screen === "apartments") {
      loadApartments();
    }

    if (screen === "users") {
      loadUsers();
    }

  }, [screen]);

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!token || !me) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3f4f6",
          padding: 20,
        }}
      >

        <div
          style={{
            background: "white",
            padding: 30,
            borderRadius: 20,
            width: "100%",
            maxWidth: 420,
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >

          <h1>
            MVX Housing System
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
            onClick={login}
            style={buttonStyle}
          >
            Login
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // ROLES
  // =========================

  const isAdmin =
    me.roles?.includes("admin");

  const hasResident =
    me.roles?.includes("resident") ||
    me.roles?.includes("owner");

  // =========================
  // MAIN APP
  // =========================

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f5f5",
        flexWrap: "wrap",
      }}
    >

      {/* SIDEBAR */}

      <div
        style={{
          width: 280,
          background: "#111827",
          color: "white",
          padding: 20,
        }}
      >

        <h2
          style={{
            color: "white",
            marginBottom: 10,
          }}
        >
          MVX System
        </h2>

        <p
          style={{
            color: "#d1d5db",
            marginBottom: 20,
          }}
        >
          User: {me.user.first_name} {me.user.last_name}
        </p>

        {/* MODE SWITCH */}

        {(isAdmin && hasResident) && (

          <div
            style={{
              marginBottom: 20,
            }}
          >

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

          </div>
        )}

        <hr
          style={{
            borderColor: "#374151",
            marginTop: 20,
            marginBottom: 20,
          }}
        />

        {/* RESIDENT MENU */}

        {mode === "resident" && (

          <>
            <MenuButton
              title="Dashboard"
              onClick={() =>
                setScreen("dashboard")
              }
            />

            <MenuButton
              title="Invoices & Payments"
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

        {/* ADMIN MENU */}

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

            <MenuButton
              title="Contractors"
              onClick={() =>
                setScreen("contractors")
              }
            />

            <MenuButton
              title="Documentation"
              onClick={() =>
                setScreen("docs")
              }
            />
          </>
        )}

        <hr
          style={{
            borderColor: "#374151",
            marginTop: 20,
            marginBottom: 20,
          }}
        />

        <button
          onClick={logout}
          style={buttonStyle}
        >
          Logout
        </button>

      </div>

      {/* CONTENT */}

      <div
        style={{
          flex: 1,
          padding: 30,
          minWidth: 320,
        }}
      >

        {/* DASHBOARD */}

        {screen === "dashboard" && (

          <div>

            <h1>
              Welcome
            </h1>

            <p>
              Logged as: {mode.toUpperCase()}
            </p>

          </div>
        )}

        {/* USERS */}

        {screen === "users" && (

          <div>

            <h1>
              Users
            </h1>

            <table style={tableStyle}>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>

                {users.map((u) => (

                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.first_name}</td>
                    <td>{u.last_name}</td>
                    <td>{u.email}</td>
                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

        {/* APARTMENTS */}

        {screen === "apartments" && (

          <div>

            <h1>
              Apartments
            </h1>

            {apartments.map((a) => (

              <div
                key={a.id}
                style={cardStyle}
              >

                <h2>
                  Apartment #{a.number}
                </h2>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >

                  <table>
                    <tbody>

                      <InfoRow
                        label="Section"
                        value={a.section}
                      />

                      <InfoRow
                        label="Floor"
                        value={a.floor}
                      />

                      <InfoRow
                        label="Levels"
                        value={a.level_count}
                      />

                      <InfoRow
                        label="Living Area"
                        value={a.living_area}
                      />

                      <InfoRow
                        label="Heated Area"
                        value={a.heated_area}
                      />

                      <InfoRow
                        label="Notes"
                        value={a.notes}
                      />

                    </tbody>
                  </table>

                </div>

                <hr />

                <strong>
                  Owners
                </strong>

                <ul>
                  {a.owners?.map((o) => (
                    <li key={o.id}>
                      {o.first_name} {o.last_name}
                    </li>
                  ))}
                </ul>

                <strong>
                  Residents
                </strong>

                <ul>
                  {a.residents?.map((r) => (
                    <li key={r.id}>
                      {r.first_name} {r.last_name}
                    </li>
                  ))}
                </ul>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

// =========================
// COMPONENTS
// =========================

function MenuButton({
  title,
  onClick,
}) {

  return (
    <button
      onClick={onClick}
      style={menuButton}
    >
      {title}
    </button>
  );
}

function InfoRow({
  label,
  value,
}) {

  return (
    <tr>
      <td style={labelStyle}>
        {label}:
      </td>

      <td>
        {value}
      </td>
    </tr>
  );
}

// =========================
// STYLES
// =========================

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