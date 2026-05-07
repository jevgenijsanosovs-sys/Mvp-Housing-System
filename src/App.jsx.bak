import { useEffect, useMemo, useState } from "react";

const API =
  "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  // =====================================================
  // AUTH
  // =====================================================

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);

  // =====================================================
  // APP STATE
  // =====================================================

  const [activeContext, setActiveContext] =
    useState("resident");

  const [section, setSection] =
    useState("dashboard");

  // =====================================================
  // LOGIN FORM
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  // DATA
  // =====================================================

  const [users, setUsers] = useState([]);
  const [apartments, setApartments] = useState([]);

  // =====================================================
  // API
  // =====================================================

  const api = async (url, options = {}) => {
    const res = await fetch(API + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: "Bearer " + token }
          : {}),
        ...(options.headers || {}),
      },
    });

    return await res.json();
  };

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    if (!token) return;

    loadMe();
  }, [token]);

  const loadMe = async () => {
    const data = await api("/api/me");

    if (data?.user) {
      setUser(data);

      // ==========================================
      // AUTO CONTEXT
      // ==========================================

      if (data.roles?.includes("admin")) {
        setActiveContext("admin");
      } else if (data.roles?.includes("worker")) {
        setActiveContext("worker");
      } else if (data.roles?.includes("accountant")) {
        setActiveContext("accountant");
      } else {
        setActiveContext("resident");
      }
    }
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async () => {
    const data = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else {
      alert(data?.error || "Login failed");
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);

    setSection("dashboard");
    setActiveContext("resident");
  };

  // =====================================================
  // LOAD ADMIN DATA
  // =====================================================

  useEffect(() => {
    if (!token) return;

    if (activeContext === "admin") {
      loadAdminData();
    }
  }, [activeContext]);

  const loadAdminData = async () => {
    const u = await api("/api/admin/users");
    const a = await api("/api/admin/apartments");

    setUsers(Array.isArray(u) ? u : []);
    setApartments(Array.isArray(a) ? a : []);
  };

  // =====================================================
  // CONTEXTS
  // =====================================================

  const availableContexts = useMemo(() => {
    if (!user?.roles) return [];

    const result = [];

    if (
      user.roles.includes("owner") ||
      user.roles.includes("resident")
    ) {
      result.push("resident");
    }

    if (user.roles.includes("admin")) {
      result.push("admin");
    }

    if (user.roles.includes("worker")) {
      result.push("worker");
    }

    if (user.roles.includes("accountant")) {
      result.push("accountant");
    }

    return result;
  }, [user]);

  // =====================================================
  // SIDEBAR
  // =====================================================

  const sidebarItems = useMemo(() => {
    // ==========================================
    // RESIDENT
    // ==========================================

    if (activeContext === "resident") {
      return [
        ["dashboard", "Dashboard"],
        ["apartment", "My Apartment"],
        ["tickets", "My Tickets"],
        ["invoices", "Invoices & Payments"],
        ["announcements", "Announcements"],
        ["chat", "House Chat"],
        ["documents", "Documents"],
      ];
    }

    // ==========================================
    // ADMIN
    // ==========================================

    if (activeContext === "admin") {
      return [
        ["dashboard", "Dashboard"],
        ["tickets-admin", "Tickets Control"],
        ["apartments", "Apartments"],
        ["users", "Users"],
        ["workers", "Workers"],
        ["contractors", "Contractors"],
        ["documents", "Documentation"],
      ];
    }

    // ==========================================
    // WORKER
    // ==========================================

    if (activeContext === "worker") {
      return [
        ["dashboard", "Dashboard"],
        ["tickets-worker", "Assigned Tickets"],
        ["schedule", "Schedule"],
        ["completed", "Completed Jobs"],
      ];
    }

    // ==========================================
    // ACCOUNTANT
    // ==========================================

    if (activeContext === "accountant") {
      return [
        ["dashboard", "Dashboard"],
        ["invoices-admin", "Invoices"],
        ["payments", "Payments"],
        ["reports", "Reports"],
      ];
    }

    return [];
  }, [activeContext]);

  // =====================================================
  // LOGIN SCREEN
  // =====================================================

  if (!token) {
    return (
      <div
        style={{
          fontFamily: "Arial",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            background: "white",
            padding: 40,
            borderRadius: 12,
            width: 350,
            boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          }}
        >
          <h1>MVP Housing System</h1>

          <p>
            Residential Management Platform
          </p>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 20,
            }}
          />

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: 12,
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN APP
  // =====================================================

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial",
      }}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div
        style={{
          width: 260,
          background: "#1f2937",
          color: "white",
          padding: 20,
        }}
      >
        <h2>MVP Housing</h2>

        <hr />

        {/* ==========================================
            CONTEXT SWITCHER
        ========================================== */}

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 12,
              opacity: 0.7,
              marginBottom: 6,
            }}
          >
            ACTIVE MODE
          </div>

          <select
            value={activeContext}
            onChange={(e) =>
              setActiveContext(e.target.value)
            }
            style={{
              width: "100%",
              padding: 8,
            }}
          >
            {availableContexts.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        {sidebarItems.map(([key, label]) => (
          <div key={key}>
            <button
              onClick={() => setSection(key)}
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 8,
                cursor: "pointer",
                textAlign: "left",
                background:
                  section === key
                    ? "#374151"
                    : "transparent",
                color: "white",
                border: "none",
              }}
            >
              {label}
            </button>
          </div>
        ))}

        <hr />

        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: 10,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        style={{
          flex: 1,
          padding: 30,
          overflow: "auto",
          background: "#f3f4f6",
        }}
      >
        {/* ==========================================
            TOPBAR
        ========================================== */}

        <div
          style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <h2>
            Welcome,{" "}
            {user?.user?.first_name ||
              user?.user?.email}
          </h2>

          <div>
            Roles:{" "}
            {(user?.roles || []).join(", ")}
          </div>

          <div>
            Current mode: {activeContext}
          </div>
        </div>

        {/* ==========================================
            DASHBOARD
        ========================================== */}

        {section === "dashboard" && (
          <div>
            <h1>
              {activeContext.toUpperCase()} DASHBOARD
            </h1>

            {/* ================= RESIDENT ================= */}

            {activeContext === "resident" && (
              <>
                <DashboardCard
                  title="My Apartment"
                  text="Apartment info, residents, ownership."
                />

                <DashboardCard
                  title="Announcements"
                  text="Building announcements."
                />

                <DashboardCard
                  title="My Tickets"
                  text="Track your repair requests."
                />

                <DashboardCard
                  title="House Chat"
                  text="Communication with residents."
                />
              </>
            )}

            {/* ================= ADMIN ================= */}

            {activeContext === "admin" && (
              <>
                <DashboardCard
                  title="Tickets Control"
                  text="Manage all building tickets."
                />

                <DashboardCard
                  title="Apartments"
                  text="Apartment management."
                />

                <DashboardCard
                  title="Users"
                  text="Users and roles."
                />

                <DashboardCard
                  title="Workers"
                  text="Workers and assignments."
                />
              </>
            )}
          </div>
        )}

        {/* =====================================================
            USERS
        ===================================================== */}

        {section === "users" && (
          <div>
            <h1>Users</h1>

            <table
              border="1"
              cellPadding="10"
              style={{
                background: "white",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* =====================================================
            APARTMENTS
        ===================================================== */}

        {section === "apartments" && (
          <div>
            <h1>Apartments</h1>

            <table
              border="1"
              cellPadding="10"
              style={{
                background: "white",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Number</th>
                  <th>Floor</th>
                  <th>Residents</th>
                </tr>
              </thead>

              <tbody>
                {apartments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.number}</td>
                    <td>{a.floor}</td>
                    <td>{a.residents_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* =====================================================
            PLACEHOLDERS
        ===================================================== */}

        {![
          "dashboard",
          "users",
          "apartments",
        ].includes(section) && (
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
            }}
          >
            <h1>{section}</h1>

            <p>
              Module architecture prepared.
            </p>

            <p>
              Backend integration will be added
              next.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// CARD
// =====================================================

function DashboardCard({ title, text }) {
  return (
    <div
      style={{
        background: "white",
        padding: 20,
        marginBottom: 20,
        borderRadius: 12,
      }}
    >
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}