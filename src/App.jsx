import { useEffect, useState } from "react";

const API = "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  const [view, setView] = useState("tickets");

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [error, setError] = useState("");

  // =========================
  // INIT SESSION
  // =========================
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;

    setToken(t);
    loadMe(t);
  }, []);

  // =========================
  // LOAD ME
  // =========================
  const loadMe = async (t) => {
    const res = await fetch(API + "/api/me", {
      headers: { Authorization: "Bearer " + t },
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
    } else {
      logout();
    }
  };

  // =========================
  // API FETCH (SAFE)
  // =========================
  const apiFetch = async (url, options = {}) => {
    const t = localStorage.getItem("token");

    const res = await fetch(API + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + t,
        ...(options.headers || {}),
      },
    });

    return await res.json();
  };

  // =========================
  // LOGIN
  // =========================
const login = async () => {
  const email = prompt("email");
  const password = prompt("password");

  try {
    const res = await fetch(API + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
	
    // 👇 ВОТ СЮДА ВСТАВЛЯЕШЬ ЛОГИ
    console.log("LOGIN RESULT:", data);
    console.log("TOKEN STATE:", data.token);
	

    if (!res.ok || !data.token) {
      setError(data.error || "login failed");
      return;
    }

    // 🔥 1. сохраняем токен
    localStorage.setItem("token", data.token);
    setToken(data.token);

    // 🔥 2. СРАЗУ грузим user (без race condition)
    const meRes = await fetch(API + "/api/me", {
      headers: {
        Authorization: "Bearer " + data.token,
      },
    });

    const me = await meRes.json();

    if (me?.user) {
      setUser(me.user);

      // 🔥 3. КРИТИЧНО: переключаем UI
      setView("tickets");
      setError("");
    } else {
      setError("auth failed");
    }

  } catch (e) {
    console.error(e);
    setError("network error");
  }
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
  // ADMIN LOAD
  // =========================
  const openAdmin = async () => {
    const me = await apiFetch("/api/me");

    if (!me.roles?.includes("admin")) {
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
      <h1>MVP Housing System</h1>

      <div>
        {!token ? (
          <button onClick={login}>Login</button>
        ) : (
          <>
            <span>{user?.email}</span>
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

      <hr />

      <button onClick={() => setView("tickets")}>Tickets</button>
      <button onClick={() => setView("apartments")}>Apartments</button>
      <button onClick={() => setView("billing")}>Billing</button>

      {/* ADMIN */}
      {view === "admin" && (
        <div>
          <h2>Admin Panel v3</h2>

          <button onClick={() => setView("tickets")}>
            Exit Admin
          </button>

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
              <h3>Roles</h3>

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

              <button onClick={saveRoles}>Save</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
}