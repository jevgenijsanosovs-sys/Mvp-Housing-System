import { useEffect, useState } from "react";

const API = "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  const [view, setView] = useState("tickets");

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [error, setError] = useState("");

  // =========================
  // INIT TOKEN
  // =========================
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  // =========================
  // SAFE FETCH (FIXED)
  // =========================
  const apiFetch = async (url, options = {}) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

      if (token) {
        headers.Authorization = "Bearer " + token;
      }

      const res = await fetch(API + url, {
        ...options,
        headers,
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
  // LOAD USERS
  // =========================
  const loadUsers = async () => {
    const data = await apiFetch("/api/admin/users");
    if (data) setUsers(data);
  };

  // =========================
  // LOAD ROLES
  // =========================
  const loadRoles = async () => {
    const data = await apiFetch("/api/admin/roles");
    if (data) setRoles(data);
  };

  // =========================
  // LOGIN (FIXED: loads user)
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

    if (!res.ok || !data.token) {
      setError(data.error || "login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);

    const me = await fetch(API + "/api/me", {
      headers: {
        Authorization: "Bearer " + data.token,
      },
    });

    const meData = await me.json();
    setUser(meData.user || null);
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setUsers([]);
    setRoles([]);
    setView("tickets");
  };

  // =========================
  // OPEN ADMIN (SAFE)
  // =========================
  const openAdmin = async () => {
    const me = await apiFetch("/api/me");

    if (!me?.roles?.includes("admin")) {
      setError("forbidden: not admin");
      return;
    }

    await loadUsers();
    await loadRoles();
    setView("admin");
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>

      {/* HEADER */}
      <h1>MVP Housing System</h1>

      <div style={{ marginBottom: 10 }}>
        {token ? (
          <>
            <span>
              Logged in {user?.email ? `(${user.email})` : ""}
            </span>

            <button onClick={logout} style={{ marginLeft: 10 }}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={login}>Login</button>
        )}

        <button onClick={openAdmin} style={{ marginLeft: 10 }}>
          Admin Panel
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: 10 }}>
          ERROR: {error}
        </div>
      )}

      <hr />

      {/* NORMAL UI */}
      {view !== "admin" && (
        <div>
          <button onClick={() => setView("tickets")}>Tickets</button>
          <button onClick={() => setView("apartments")}>Apartments</button>
          <button onClick={() => setView("billing")}>Billing</button>

          <h3>Welcome to MVP Housing System</h3>
        </div>
      )}

      {/* ADMIN */}
      {view === "admin" && (
        <div>
          <h2>Admin Panel v2</h2>

          <h3>Users</h3>
          {users.map(u => (
            <div key={u.id}>
              {u.email}
            </div>
          ))}

          <h3>Roles</h3>
          {roles.map(r => (
            <div key={r.id}>
              {r.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}