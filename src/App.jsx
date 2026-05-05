import { useState, useEffect } from "react";

const API = "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  const [view, setView] = useState("tickets");

  // =========================
  // AUTH STATE
  // =========================
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // =========================
  // APARTMENTS
  // =========================
  const [apartments, setApartments] = useState([]);

  // =========================
  // TICKETS
  // =========================
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState("");

  // =========================
  // LOGIN FORM
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // METERS
  // =========================
  const [meters, setMeters] = useState([]);
  const [readings, setReadings] = useState({});

  // =========================
  // INVOICES (MOCK)
  // =========================
  const [invoices] = useState([
    { id: 1, period: "2026-02", amount: 50.7 },
    { id: 2, period: "2026-03", amount: 47.12 },
    { id: 3, period: "2026-04", amount: 45.2 },
  ]);

  // =========================
  // LOAD METERS
  // =========================
  useEffect(() => {
    setMeters([
      { id: 1, serial: "A123", location: "Kitchen" },
      { id: 2, serial: "A124", location: "Kitchen" },
      { id: 3, serial: "B223", location: "Bathroom" },
      { id: 4, serial: "B224", location: "Bathroom" },
    ]);
  }, []);

  // =========================
  // AUTO LOGIN
  // =========================
  useEffect(() => {
    if (token) {
      loadMe(token);
    }
  }, []);

  // =========================
  // LOAD APARTMENTS
  // =========================
  useEffect(() => {
    if (!token) return;

    fetch(`${API}/api/my-apartments`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((r) => r.json())
      .then(setApartments)
      .catch(console.error);
  }, [token]);

  // =========================
  // LOAD TICKETS
  // =========================
  useEffect(() => {
    fetch(`${API}/api/tickets`)
      .then((r) => r.json())
      .then(setTickets)
      .catch(console.error);
  }, []);

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
      alert(data.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);

    loadMe(data.token);
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
  // LOAD USER
  // =========================
  const loadMe = async (jwt) => {
    const res = await fetch(API + "/api/me", {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
    }
  };

  // =========================
  // ADD TICKET
  // =========================
  const addTicket = async () => {
    if (!newTicket.trim()) return;

    await fetch(`${API}/api/tickets`, {
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
  // UI
  // =========================
  return (
    <div style={styles.container}>
      <h1>MVP Housing System</h1>

      {/* LOGIN */}
      {!token ? (
        <div>
          <h3>Login</h3>

          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <p>Logged in as: {user?.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}

      {/* NAV */}
      <hr />

      <button onClick={() => setView("tickets")}>Tickets</button>
      <button onClick={() => setView("apartments")}>Apartments</button>
      <button onClick={() => setView("billing")}>Billing</button>

      {/* TICKETS */}
      {view === "tickets" && (
        <div>
          <h3>Tickets</h3>

          <input
            value={newTicket}
            onChange={(e) => setNewTicket(e.target.value)}
          />

          <button onClick={addTicket}>Add</button>

          {tickets.map((t) => (
            <div key={t.id}>{t.text}</div>
          ))}
        </div>
      )}

      {/* APARTMENTS */}
      {view === "apartments" && (
        <div>
          <h3>Apartments</h3>

          {apartments.map((a) => (
            <div key={a.id}>
              #{a.number} ({a.section}) - {a.relation_type}
            </div>
          ))}
        </div>
      )}

      {/* BILLING */}
      {view === "billing" && (
        <div>
          <h3>Invoices</h3>

          {invoices.map((i) => (
            <div key={i.id}>
              {i.period} - {i.amount}€
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial",
    padding: 20,
  },
};