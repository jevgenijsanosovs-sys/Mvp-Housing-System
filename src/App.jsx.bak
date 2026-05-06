import { useEffect, useState } from "react";

const API = "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [view, setView] = useState("home");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  // =========================
  // API
  // =========================
  const api = async (url, options = {}) => {
    try {
      const res = await fetch(API + url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? "Bearer " + token : "",
          ...(options.headers || {}),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "API error");
        return null;
      }

      return data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  };

  // =========================
  // LOAD USER
  // =========================
  useEffect(() => {
    if (!token) return;

    api("/api/me").then((d) => {
      if (d?.user) {
        setUser(d.user);
      } else {
        setToken(null);
      }
    });
  }, [token]);

  // =========================
  // LOGIN
  // =========================
  const login = async () => {
    const res = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res?.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setView("home");
      setError("");
    } else {
      setError("login failed");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setView("home");
  };

  // =========================
  // ADMIN
  // =========================
  const openAdmin = async () => {
    const u = await api("/api/admin/users");
    const r = await api("/api/admin/roles");

    if (!u || !r) return;

    setUsers(u);
    setRoles(r);
    setSelectedUser(null);
    setSelectedRoles([]);

    setView("admin");
  };

  const backHome = () => {
    setView("home");
  };

  const selectUser = (id) => {
    setSelectedUser(id);
    setSelectedRoles([]); // reset
  };

  const toggleRole = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const saveRoles = async () => {
    if (!selectedUser) {
      alert("Select user first");
      return;
    }

    await api("/api/admin/set-roles", {
      method: "POST",
      body: JSON.stringify({
        user_id: selectedUser,
        roles: selectedRoles,
      }),
    });

    alert("Roles updated");
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>MVP Housing System</h1>

      {/* ================= LOGIN ================= */}
      {!token ? (
        <div>
          <input
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>

          {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
      ) : (
        <div>
          <p>Logged in: {user?.email}</p>

          <button onClick={logout}>Logout</button>
          <button onClick={() => setView("home")}>Home</button>
          <button onClick={openAdmin}>Admin Panel</button>
        </div>
      )}

      <hr />

      {/* ================= HOME ================= */}
      {view === "home" && token && (
        <div>
          <h2>Main Menu</h2>

          <button onClick={() => alert("Tickets coming soon")}>
            Tickets
          </button>

          <button onClick={() => alert("Apartments coming soon")}>
            Apartments
          </button>

          <button onClick={() => alert("Billing coming soon")}>
            Billing
          </button>
        </div>
      )}

      {/* ================= ADMIN ================= */}
      {view === "admin" && (
        <div>
          <h2>Admin Panel v3</h2>

          <button onClick={backHome}>⬅ Back</button>

          <div style={{ display: "flex", gap: 40, marginTop: 20 }}>
            {/* USERS */}
            <div>
              <h3>Users</h3>
              {users.map((u) => (
                <div key={u.id}>
                  <button onClick={() => selectUser(u.id)}>
                    {u.email}
                  </button>
                </div>
              ))}
            </div>

            {/* ROLES */}
            <div>
              <h3>Roles</h3>

              {roles.map((r) => (
                <div key={r.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(r.id)}
                      onChange={() => toggleRole(r.id)}
                    />
                    {r.name}
                  </label>
                </div>
              ))}

              <br />

              <button onClick={saveRoles}>Save Roles</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}