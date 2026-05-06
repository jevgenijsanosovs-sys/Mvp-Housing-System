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

  // =========================
  // SAFE FETCH
  // =========================
  const api = async (url, options = {}) => {
    const res = await fetch(API + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? "Bearer " + token : "",
        ...(options.headers || {}),
      },
    });

	const data = await res.json();

	if (!res.ok || data.error) {
	  return { error: data.error || "api_error" };
	}

	return data;

  };

  // =========================
  // LOAD USER
  // =========================
  useEffect(() => {
    if (!token) return;

    api("/api/me").then((d) => {
      if (d.user) setUser(d);
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

    if (res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
    } else {
      alert(res.error || "Login failed");
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
  // ADMIN LOAD
  // =========================
  const openAdmin = async () => {
    const u = await api("/api/admin/users");
    const r = await api("/api/admin/roles");

    setUsers(u || []);
    setRoles(r || []);
    setView("admin");
  };

  // =========================
  // SAVE ROLES
  // =========================
  const saveRoles = async () => {
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
      <h1>MVX Housing System</h1>

      {!token ? (
        <div>
          <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <p>Logged in: {user?.user?.email}</p>
          <button onClick={logout}>Logout</button>
          <button onClick={openAdmin}>Admin Panel</button>
        </div>
      )}

      <hr />

      {/* ================= ADMIN ================= */}
      {view === "admin" && (
        <div>
          <h2>Admin Panel v3</h2>

          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <h3>Users</h3>
              {users.map((u) => (
                <div key={u.id}>
                  <button onClick={() => setSelectedUser(u.id)}>
                    {u.email}
                  </button>
                </div>
              ))}
            </div>

            <div>
              <h3>Roles</h3>
              {roles.map((r) => (
                <label key={r.id}>
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(r.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles([...selectedRoles, r.id]);
                      } else {
                        setSelectedRoles(selectedRoles.filter(x => x !== r.id));
                      }
                    }}
                  />
                  {r.name}
                </label>
              ))}

              <br />
              <button onClick={saveRoles}>Save roles</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}