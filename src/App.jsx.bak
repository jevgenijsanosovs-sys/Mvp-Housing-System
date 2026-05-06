import { useEffect, useState } from "react";

const API = "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  const [view, setView] = useState("tickets");

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [error, setError] = useState("");

  // =========================
  // SAFE FETCH
  // =========================
  const apiFetch = async (url, options = {}) => {
    try {
      const res = await fetch(API + url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          ...(options.headers || {}),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "API error");
        return null;
      }

      setError("");
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async () => {
    const email = prompt("email");
    const password = prompt("password");

    const res = await fetch(API + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.token) {
      setError("login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);

    const me = await apiFetch("/api/me");
    setUser(me?.user || null);
  };

  // =========================
  // LOAD ADMIN DATA
  // =========================
  const openAdmin = async () => {
    const me = await apiFetch("/api/me");

    if (!me?.roles?.includes("admin")) {
      setError("forbidden");
      return;
    }

    const u = await apiFetch("/api/admin/users");
    const r = await apiFetch("/api/admin/roles");

    setUsers(u || []);
    setRoles(r || []);

    setView("admin");
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setView("tickets");
  };

  // =========================
  // SAVE ROLES
  // =========================
  const saveRoles = async () => {
    if (!selectedUser) return;

    await apiFetch("/api/admin/set-roles", {
      method: "POST",
      body: JSON.stringify({
        user_id: selectedUser.id,
        roles: selectedRoles,
      }),
    });

    alert("roles updated");
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>

      {/* HEADER */}
      <h1>MVP Housing System</h1>

      <div style={{ marginBottom: 10 }}>
        {!token ? (
          <button onClick={login}>Login</button>
        ) : (
          <>
            <span>Logged in</span>
            <button onClick={logout} style={{ marginLeft: 10 }}>
              Logout
            </button>
          </>
        )}

        <button onClick={openAdmin} style={{ marginLeft: 10 }}>
          Admin
        </button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* NAV */}
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setView("tickets")}>Tickets</button>
        <button onClick={() => setView("apartments")}>Apartments</button>
        <button onClick={() => setView("billing")}>Billing</button>
      </div>

      {/* ADMIN */}
      {view === "admin" && (
        <div>
          <h2>Admin Panel v2</h2>

          <h3>Users</h3>
          {users.map((u) => (
            <div key={u.id}>
              <button onClick={() => setSelectedUser(u)}>
                {u.email}
              </button>
            </div>
          ))}

          {selectedUser && (
            <>
              <h3>Roles for {selectedUser.email}</h3>

              {roles.map((r) => (
                <label key={r.id}>
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(r.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles([...selectedRoles, r.name]);
                      } else {
                        setSelectedRoles(
                          selectedRoles.filter((x) => x !== r.name)
                        );
                      }
                    }}
                  />
                  {r.name}
                </label>
              ))}

              <button onClick={saveRoles}>Save roles</button>
              <button onClick={() => setView("tickets")}>
                Exit admin
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}