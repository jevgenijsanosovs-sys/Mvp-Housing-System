import { useState, useEffect } from "react";

const API = "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  const [view, setView] = useState("tickets");

  // =========================
  // AUTH
  // =========================
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // =========================
  // ADMIN
  // =========================
  const [adminUsers, setAdminUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  // =========================
  // DATA
  // =========================
  const [apartments, setApartments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState("");

  // =========================
  // LOGIN FORM
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // AUTO LOGIN
  // =========================
  useEffect(() => {
    if (token) loadMe(token);
  }, []);

  // =========================
  // LOAD USER
  // =========================
  const loadMe = async (jwt) => {
    const res = await fetch(API + "/api/me", {
      headers: { Authorization: "Bearer " + jwt },
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
      setRoles(data.roles || []);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async () => {
    const res = await fetch(API + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);

    await loadMe(data.token);
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setRoles([]);
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetch(API + "/api/tickets")
      .then(r => r.json())
      .then(setTickets);
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch(API + "/api/my-apartments", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(r => r.json())
      .then(setApartments);
  }, [token]);

  // =========================
  // ADD TICKET
  // =========================
  const addTicket = async () => {
    if (!newTicket.trim()) return;

    await fetch(API + "/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ text: newTicket }),
    });

    setTickets([{ id: Date.now(), text: newTicket }, ...tickets]);
    setNewTicket("");
  };

  // =========================
  // ADMIN LOAD
  // =========================
  const loadAdminData = async () => {
    const headers = { Authorization: "Bearer " + token };

    const users = await fetch(API + "/api/admin/users", { headers })
      .then(r => r.json());

    const roles = await fetch(API + "/api/admin/roles")
      .then(r => r.json());

    setAdminUsers(users);
    setAllRoles(roles);
  };

  // =========================
  // ADMIN EDIT
  // =========================
  const editUserRoles = (user) => {
    setEditingUser(user);
    setSelectedRoles([]);
  };

  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const saveRoles = async () => {
    await fetch(API + "/api/admin/set-roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        user_id: editingUser.id,
        roles: selectedRoles,
      }),
    });

    setEditingUser(null);
    loadAdminData();
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>MVP Housing</h1>

      {/* LOGIN */}
      {!token ? (
        <div>
          <input placeholder="email" onChange={e => setEmail(e.target.value)} />
          <input type="password" onChange={e => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <p>{user?.email}</p>
          <p>Roles: {roles.join(", ")}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}

      <hr />

      {/* NAV */}
      <button onClick={() => setView("tickets")}>Tickets</button>
      <button onClick={() => setView("apartments")}>Apartments</button>

      {roles.includes("admin") && (
        <button onClick={() => {
          setView("admin");
          loadAdminData();
        }}>
          Admin
        </button>
      )}

      {/* TICKETS */}
      {view === "tickets" && (
        <div>
          <h3>Tickets</h3>
          <input value={newTicket} onChange={e => setNewTicket(e.target.value)} />
          <button onClick={addTicket}>Add</button>

          {tickets.map(t => (
            <div key={t.id}>{t.text}</div>
          ))}
        </div>
      )}

      {/* APARTMENTS */}
      {view === "apartments" && (
        <div>
          <h3>Apartments</h3>
          {apartments.map(a => (
            <div key={a.id}>
              #{a.number} ({a.section}) - {a.relation_type}
            </div>
          ))}
        </div>
      )}

      {/* ADMIN PANEL */}
      {view === "admin" && (
        <div>
          <h3>Admin Panel</h3>

          {adminUsers.map(u => (
            <div key={u.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
              <b>{u.email}</b>

              <button onClick={() => editUserRoles(u)}>
                Edit Roles
              </button>
            </div>
          ))}

          {/* ROLE EDIT MODAL */}
          {editingUser && (
            <div style={{ border: "2px solid black", padding: 10 }}>
              <h4>Edit roles for {editingUser.email}</h4>

              {allRoles.map(r => (
                <label key={r.name} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(r.name)}
                    onChange={() => toggleRole(r.name)}
                  />
                  {r.name}
                </label>
              ))}

              <button onClick={saveRoles}>Save</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}