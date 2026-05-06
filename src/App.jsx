import { useEffect, useState } from "react";

const API = "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [view, setView] = useState("home");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [apartmentDetails, setApartmentDetails] = useState(null);

  // =========================
  // API
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

    return res.json();
  };

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    if (!token) return;

    api("/api/me").then((d) => {
      if (d.user) setUser(d);
    });
  }, [token]);

  const login = async () => {
    const res = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
    } else {
      alert("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setView("home");
  };

  // =========================
  // ADMIN LOAD
  // =========================
  const openAdmin = async () => {
    const u = await api("/api/admin/users");
    const r = await api("/api/admin/roles");
    const a = await api("/api/admin/apartments");

    setUsers(u || []);
    setRoles(r || []);
    setApartments(a || []);

    setView("admin");
  };

  // =========================
  // USER ROLES LOAD
  // =========================
  const selectUser = async (id) => {
    setSelectedUser(id);

    const res = await api(`/api/admin/user-roles?user_id=${id}`);
    setUserRoles(res.roles || []);
  };

  // =========================
  // SAVE ROLES
  // =========================
  const saveRoles = async () => {
    await api("/api/admin/set-roles", {
      method: "POST",
      body: JSON.stringify({
        user_id: selectedUser,
        roles: userRoles,
      }),
    });

    alert("Roles updated");
  };

  // =========================
  // APARTMENT DETAILS
  // =========================
  const openApartment = async (id) => {
    setSelectedApartment(id);

    const res = await api(`/api/admin/apartment-details?id=${id}`);
    setApartmentDetails(res);
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>MVP Housing System</h1>

      {/* LOGIN */}
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
          <h2>Admin Panel v4</h2>

          <button onClick={() => setView("home")}>← Back</button>

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
                <label key={r.id} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={userRoles.includes(r.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setUserRoles([...userRoles, r.id]);
                      } else {
                        setUserRoles(userRoles.filter(x => x !== r.id));
                      }
                    }}
                  />
                  {r.name}
                </label>
              ))}

              <br />
              <button onClick={saveRoles} disabled={!selectedUser}>
                Save roles
              </button>
            </div>

            {/* APARTMENTS */}
            <div>
              <h3>Apartments</h3>
              {apartments.map((a) => (
                <div key={a.id}>
                  <button onClick={() => openApartment(a.id)}>
                    #{a.number}
                  </button>
                </div>
              ))}
            </div>

            {/* APARTMENT DETAILS */}
            <div>
              <h3>Details</h3>

              {apartmentDetails && (
                <div>
                  <p><b>Number:</b> {apartmentDetails.apartment.number}</p>
                  <p><b>Section:</b> {apartmentDetails.apartment.section}</p>
                  <p><b>Floor:</b> {apartmentDetails.apartment.floor}</p>
                  <p><b>Living:</b> {apartmentDetails.apartment.living_area}</p>
                  <p><b>Heated:</b> {apartmentDetails.apartment.heated_area}</p>
                  <p><b>Levels:</b> {apartmentDetails.apartment.level_count}</p>
                  <p><b>Notes:</b> {apartmentDetails.apartment.notes}</p>

                  <h4>Owners</h4>
                  {apartmentDetails.owners.map(o => (
                    <div key={o.id}>{o.email}</div>
                  ))}

                  <h4>Residents</h4>
                  {apartmentDetails.residents.map(r => (
                    <div key={r.id}>{r.email}</div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}