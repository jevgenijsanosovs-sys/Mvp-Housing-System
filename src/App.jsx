import { useState, useEffect } from "react";

export default function App() {
  const [view, setView] = useState("tickets");

  // =========================
  // TICKETS
  // =========================
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState("");

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
    { id: 1, period: "2026-02", amount: 50.7, status: "paid" },
    { id: 2, period: "2026-03", amount: 47.12, status: "paid" },
    { id: 3, period: "2026-04", amount: 45.2, status: "new" },
  ]);

  // =========================
  // LOAD METERS
  // =========================
  useEffect(() => {
    setMeters([
      { id: 1, serial: "A123", type: "cold", location: "Kitchen" },
      { id: 2, serial: "A124", type: "hot", location: "Kitchen" },
      { id: 3, serial: "B223", type: "cold", location: "Bathroom" },
      { id: 4, serial: "B224", type: "hot", location: "Bathroom" },
      { id: 5, serial: "C323", type: "cold", location: "WC" },
      { id: 6, serial: "C324", type: "hot", location: "WC" },
    ]);
  }, []);

  // =========================
// LOAD TICKETS FROM BACKEND
// =========================
useEffect(() => {
  fetch("https://noisy-band-27a3.jevgenijs-anosovs.workers.dev/api/tickets")
    .then((res) => res.json())
    .then((data) => setTickets(data))
    .catch((err) => console.error("Fetch error:", err));
}, []);

  // =========================
  // GROUP METERS
  // =========================
  const groupedMeters = meters.reduce((acc, m) => {
    if (!acc[m.location]) acc[m.location] = [];
    acc[m.location].push(m);
    return acc;
  }, {});

  // =========================
  // TICKETS
  // =========================
const addTicket = async () => {
  if (!newTicket.trim()) return;

  try {
    const res = await fetch("https://noisy-band-27a3.jevgenijs-anosovs.workers.dev/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newTicket }),
    });

    const data = await res.json();
    console.log("API response:", data);

    setTickets([...tickets, { id: Date.now(), text: newTicket }]);
    setNewTicket("");
  } catch (err) {
    console.error("POST error:", err);
  }
};

const login = async (email, password) => {
  try {
    const res = await fetch("https://noisy-band-27a3.jevgenijs-anosovs.workers.dev/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // 🔐 сохраняем JWT
    localStorage.setItem("token", data.token);

    alert("Login success!");
  } catch (err) {
    console.error(err);
  }
};

  // =========================
  // METERS INPUT
  // =========================
  const handleReadingChange = (id, value) => {
    setReadings((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // =========================
  // SAVE READINGS
  // =========================
  const saveReadings = () => {
    const payload = meters.map((m) => ({
      meter_id: m.id,
      serial: m.serial,
      type: m.type,
      location: m.location,
      value: readings[m.id] || "",
    }));

    console.log("SEND TO BACKEND:", payload);
    alert("Readings saved (check console)");
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>MVX Housing System</h1>

      <div style={{ marginBottom: 20 }}>
        <h2>Login</h2>

        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.btn} onClick={() => login(email, password)}>
            Login
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={styles.nav}>
        <button style={styles.btn} onClick={() => setView("tickets")}>
          Tickets
        </button>
        <button style={styles.btn} onClick={() => setView("meters")}>
          Meter Readings
        </button>
        <button style={styles.btn} onClick={() => setView("billing")}>
          Invoices
        </button>
      </div>

      {/* =========================
          TICKETS
      ========================= */}
      {view === "tickets" && (
        <div style={styles.card}>
          <h2>Service Requests</h2>

          <div style={styles.row}>
            <input
              style={styles.input}
              value={newTicket}
              onChange={(e) => setNewTicket(e.target.value)}
              placeholder="Enter request..."
            />
            <button style={styles.btn} onClick={addTicket}>
              Add
            </button>
          </div>

          <ul>
            {tickets.map((t) => (
              <li key={t.id}>{t.text}</li>
            ))}
          </ul>
        </div>
      )}

      {/* =========================
          METERS
      ========================= */}
      {view === "meters" && (
        <div style={styles.card}>
          <h2>Meter Readings</h2>

          {Object.keys(groupedMeters).map((location) => (
            <div key={location}>
              <h3>{location}</h3>

              {groupedMeters[location].map((m) => (
                <div key={m.id} style={styles.meterBox}>
                  <div>
                    {m.type.toUpperCase()} | {m.serial}
                  </div>

                  <input
                    style={styles.input}
                    placeholder="Enter value"
                    value={readings[m.id] || ""}
                    onChange={(e) =>
                      handleReadingChange(m.id, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          ))}

          <button style={styles.btn} onClick={saveReadings}>
            Save Readings
          </button>
        </div>
      )}

      {/* =========================
          INVOICES
      ========================= */}
      {view === "billing" && (
        <div style={styles.card}>
          <h2>Invoices</h2>

          <ul>
            {invoices.map((inv) => (
              <li key={inv.id}>
                {inv.period} — {inv.amount}€ —{" "}
                <span
                  style={{
                    color: inv.status === "new" ? "red" : "green",
                  }}
                >
                  {inv.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// =========================
// SIMPLE STYLES
// =========================
const styles = {
  container: {
    fontFamily: "Arial",
    padding: 20,
    maxWidth: 900,
    margin: "0 auto",
  },
  title: {
    marginBottom: 20,
  },
  nav: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    border: "1px solid #ccc",
    padding: 15,
    borderRadius: 8,
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },
  input: {
    padding: 8,
    flex: 1,
  },
  btn: {
    padding: "8px 12px",
    cursor: "pointer",
  },
  meterBox: {
    padding: 10,
    border: "1px solid #ddd",
    marginBottom: 10,
  },
};

