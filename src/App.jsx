import { useEffect, useState } from "react";

const API = "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [view, setView] = useState("users");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [loading, setLoading] = useState(false);
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
          Authorization: token ? "Bearer " + token : "",
          ...(options.headers || {}),
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "API error");
      }

      return data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  };

  // =========================
  // LOAD ME
  // =========================
  const loadMe = async () => {
    const data = await apiFetch("/api/me");
    if (data?.user) setUser(data.user);
  };

  // =========================
  // LOAD USERS
  // =========================
  const loadUsers = async () => {
    setLoading(true);
    const data = await apiFetch("/api/admin/users");
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  // =========================
  // LOAD ROLES
  // =========================
  const loadRoles = async () => {
    const data = await apiFetch("/api/admin/roles");
    setRoles(Array.isArray(data) ? data : []);
  };

  // =========================
  // LOGIN (simple)
  // =========================
  const login = async () => {
    const email = prompt("email");
    const password = prompt("password");

    const data = await apiFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      await loadMe();
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // =========================
  // OPEN ROLE EDITOR
  // =========================
  const openRoleEditor = (u) => {
    setSelectedUser(u);
    setSelectedRoles(u.roles || []);
  };

  // =========================
  // TOGGLE ROLE
  // =========================
  const toggleRole = (roleName) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
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

    setSelectedUser(null);
    setSelectedRoles([]);
    loadUsers();
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    if (token) {
      loadMe();
      loadUsers();
      loadRoles();
    }
  }, [token]);

  // =========================
  // UI SAFETY
  // =========================
  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Admin Panel Login</h2>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Admin Panel v2</h2>

      {/* USER BAR */}
      <div style={{ marginBottom: 10 }}>
        Logged in: {user?.email || "loading..."}
        <button onClick={logout} style={{ marginLeft: 10 }}>
          Logout
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ color: "red", marginBottom: 10 }}>
          ERROR: {error}
        </div>
      )}

      {/* NAV */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setView("users")}>Users</button>
      </div>

      {/* USERS */}
      {view === "users" && (
        <div>
          <h3>Users</h3>

          {loading && <p>Loading...</p>}

          {(users || []).map((u) => (
            <div
              key={u.id}
              style={{
                padding: 10,
                border: "1px solid #ddd",
                marginBottom: 8,
              }}
            >
              <div>
                {u.email}
              </div>

              <button onClick={() => openRoleEditor(u)}>
                Edit roles
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ROLE MODAL */}
      {selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 50,
            left: 50,
            right: 50,
            background: "#fff",
            border: "2px solid #000",
            padding: 20,
          }}
        >
          <h3>Edit roles: {selectedUser.email}</h3>

          {(roles || []).map((r) => (
            <label key={r.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={selectedRoles.includes(r.name)}
                onChange={() => toggleRole(r.name)}
              />
              {r.name}
            </label>
          ))}

          <button onClick={saveRoles}>Save</button>
          <button onClick={() => setSelectedUser(null)}>Close</button>
        </div>
      )}
    </div>
  );
}