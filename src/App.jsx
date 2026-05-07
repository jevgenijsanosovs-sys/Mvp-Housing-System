import { useEffect, useState } from "react";

const API =
  "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [me, setMe] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [screen, setScreen] = useState("dashboard");

  const [apartments, setApartments] = useState([]);

  // =========================
  // API
  // =========================
  const api = async (url, options = {}) => {
    const res = await fetch(API + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token
          ? "Bearer " + token
          : "",
        ...(options.headers || {}),
      },
    });

    return res.json();
  };

  // =========================
  // LOAD USER
  // =========================
  useEffect(() => {
    if (!token) return;

    api("/api/me").then((d) => {
      if (d.user) {
        setMe(d);
      }
    });
  }, [token]);

  // =========================
  // LOGIN
  // =========================
  const login = async () => {
    const res = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
    } else {
      alert("Login failed");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setMe(null);
  };

  // =========================
  // LOAD APARTMENTS
  // =========================
  const openApartments = async () => {
    const data = await api(
      "/api/apartments/full"
    );

    setApartments(
      Array.isArray(data) ? data : []
    );

    setScreen("apartments");
  };

  // =========================
  // LOGIN SCREEN
  // =========================
  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f4f4",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            background: "white",
            padding: 30,
            borderRadius: 12,
            width: 320,
            boxShadow:
              "0 0 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2>MVP Housing System</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "100%",
              marginBottom: 10,
              padding: 10,
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              marginBottom: 10,
              padding: 10,
            }}
          />

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: 10,
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================
  return (
    <div
      style={{
        fontFamily: "Arial",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TOPBAR */}
      <div
        style={{
          background: "#1f2937",
          color: "white",
          padding: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <strong>
            MVP Housing System
          </strong>
        </div>

        <div>
          {me?.user?.email}
        </div>

        <div>
          <button
            onClick={() =>
              setScreen("dashboard")
            }
          >
            Dashboard
          </button>

          {me?.roles?.includes(
            "admin"
          ) && (
            <button
              onClick={openApartments}
              style={{
                marginLeft: 10,
              }}
            >
              Apartments
            </button>
          )}

          <button
            onClick={logout}
            style={{
              marginLeft: 10,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ padding: 20 }}>
        {/* DASHBOARD */}
        {screen === "dashboard" && (
          <div>
            <h2>Welcome</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              <div
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <h3>My Apartment</h3>

                <p>
                  Apartment info will
                  be here
                </p>
              </div>

              <div
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <h3>Tickets</h3>

                <p>
                  Resident ticket
                  view
                </p>
              </div>

              <div
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <h3>
                  Announcements
                </h3>

                <p>
                  House announcements
                </p>
              </div>

              <div
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <h3>House Chat</h3>

                <p>
                  Future realtime
                  chat
                </p>
              </div>
            </div>
          </div>
        )}

        {/* APARTMENTS */}
        {screen === "apartments" && (
          <div>
            <h2>Apartments</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 20,
              }}
            >
              {apartments.map((a) => (
                <div
                  key={a.id}
                  style={{
                    border:
                      "1px solid #ccc",
                    borderRadius: 12,
                    padding: 20,
                    background: "white",
                  }}
                >
                  <h3>
                    Apartment{" "}
                    {a.number}
                  </h3>

                  <p>
                    Section:{" "}
                    {a.section}
                  </p>

                  <p>
                    Floor: {a.floor}
                  </p>

                  <p>
                    Levels:{" "}
                    {a.level_count}
                  </p>

                  <p>
                    Living Area:{" "}
                    {a.living_area}
                  </p>

                  <p>
                    Heated Area:{" "}
                    {a.heated_area}
                  </p>

                  <p>
                    Residents Count:{" "}
                    {a.residents_count}
                  </p>

                  <p>
                    Notes:{" "}
                    {a.notes || "-"}
                  </p>

                  <hr />

                  <strong>
                    Owners:
                  </strong>

                  {(a.owners || []).map(
                    (o) => (
                      <div
                        key={o.id}
                      >
                        {
                          o.first_name
                        }{" "}
                        {
                          o.last_name
                        }
                      </div>
                    )
                  )}

                  <br />

                  <strong>
                    Residents:
                  </strong>

                  {(a.residents || []).map(
                    (r) => (
                      <div
                        key={r.id}
                      >
                        {
                          r.first_name
                        }{" "}
                        {
                          r.last_name
                        }
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}