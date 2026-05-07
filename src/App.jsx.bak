import { useEffect, useState } from "react";

const API =
  "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {

  // =========================
  // AUTH
  // =========================

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [me, setMe] = useState(null);

  // =========================
  // LOGIN FORM
  // =========================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // UI STATE
  // =========================

  const [mode, setMode] = useState("resident");

  const [screen, setScreen] = useState("dashboard");

  // =========================
  // DATA
  // =========================

  const [apartments, setApartments] = useState([]);
  const [users, setUsers] = useState([]);

  // =========================
  // API
  // =========================

  const api = async (url, options = {}) => {

    const res = await fetch(API + url, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        Authorization:
          token
            ? "Bearer " + token
            : "",

        ...(options.headers || {}),
      },
    });

    return await res.json();
  };

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {

    if (!token) return;

    api("/api/me")
      .then((d) => {

        if (d?.user) {

          setMe(d);

          // default mode
          if (d.roles?.includes("admin")) {
            setMode("admin");
          }

        } else {

          logout();

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

      localStorage.setItem(
        "token",
        res.token
      );

      setToken(res.token);

    } else {

      alert(
        res?.error || "Login failed"
      );

    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);

    setMe(null);

    setScreen("dashboard");

  };

  // =========================
  // LOAD ADMIN DATA
  // =========================

  const loadApartments = async () => {

    const d = await api(
      "/api/apartments/full"
    );

    setApartments(d || []);

  };

  const loadUsers = async () => {

    const d = await api(
      "/api/admin/users"
    );

    setUsers(d || []);

  };

  // =========================
  // SCREEN LOADERS
  // =========================

  useEffect(() => {

    if (screen === "apartments") {
      loadApartments();
    }

    if (screen === "users") {
      loadUsers();
    }

  }, [screen]);

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!token || !me) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3f4f6",
          padding: 20,
        }}
      >

        <div
          style={{
            background: "white",
            padding: 30,
            borderRadius: 20,
            width: "100%",
            maxWidth: 400,
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >

          <h1>
            MVX Housing System
          </h1>

          <p>
            Residential Management Platform
          </p>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={login}
            style={buttonStyle}
          >
            Login
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // MAIN APP
  // =========================

  const isAdmin =
    me.roles?.includes("admin");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >

      {/* ================= SIDEBAR ================= */}

      <div
        style={{
          width: 260,
          background: "#111827",
          color: "white",
          padding: 20,
        }}
      >

		<h2
		  style={{
			color: "white",
			marginBottom: 10,
		  }}
		>
		  MVX System
		</h2>

		<p
		  style={{
			color: "#d1d5db",
			marginBottom: 20,
		  }}
		>
		  {me.user.first_name}
		  {" "}
		  {me.user.last_name}
		</p>

        {/* MODE SWITCH */}

        {isAdmin && (
			{/* MODE SWITCH */}

			<div
			  style={{
				marginTop: 20,
				marginBottom: 20,
			  }}
			>

			  {/* RESIDENT MODE */}

			  {(me.roles?.includes("resident") ||
				me.roles?.includes("owner")) && (

				<div>
				  <button
					style={
					  mode === "resident"
						? activeButton
						: menuButton
					}
					onClick={() =>
					  setMode("resident")
					}
				  >
					Resident Mode
				  </button>
				</div>
			  )}

			  {/* ADMIN MODE */}

			  {me.roles?.includes("admin") && (
				<div>
				  <button
					style={
					  mode === "admin"
						? activeButton
						: menuButton
					}
					onClick={() =>
					  setMode("admin")
					}
				  >
					Admin Mode
				  </button>
				</div>
			  )}

			</div>
        )}

        {/* RESIDENT */}

        {mode === "resident" && (
          <>

            <MenuButton
              title="Dashboard"
              onClick={() =>
                setScreen("dashboard")
              }
            />

            <MenuButton
              title="Invoices & Payments"
              onClick={() =>
                setScreen("invoices")
              }
            />

            <MenuButton
              title="Tickets"
              onClick={() =>
                setScreen("tickets")
              }
            />

            <MenuButton
              title="Chat"
              onClick={() =>
                setScreen("chat")
              }
            />

          </>
        )}

        {/* ADMIN */}

        {mode === "admin" && (
          <>

            <MenuButton
              title="Dashboard"
              onClick={() =>
                setScreen("dashboard")
              }
            />

            <MenuButton
              title="Users"
              onClick={() =>
                setScreen("users")
              }
            />

            <MenuButton
              title="Apartments"
              onClick={() =>
                setScreen("apartments")
              }
            />

            <MenuButton
              title="Tickets"
              onClick={() =>
                setScreen("tickets-admin")
              }
            />

            <MenuButton
              title="Workers"
              onClick={() =>
                setScreen("workers")
              }
            />

            <MenuButton
              title="Contractors"
              onClick={() =>
                setScreen("contractors")
              }
            />

            <MenuButton
              title="Documentation"
              onClick={() =>
                setScreen("docs")
              }
            />

          </>
        )}

        <hr />

        <button
          onClick={logout}
          style={buttonStyle}
        >
          Logout
        </button>

      </div>

      {/* ================= CONTENT ================= */}

      <div
        style={{
          flex: 1,
          padding: 30,
        }}
      >
		<hr
		  style={{
			borderColor: "#374151",
			marginTop: 20,
			marginBottom: 20,
		  }}
		/>

        {/* DASHBOARD */}

        {screen === "dashboard" && (
          <div>

            <h1>
              Welcome
            </h1>

            <p>
              Logged as:
              {" "}
              {mode.toUpperCase()}
            </p>

            <div style={cardStyle}>
              <h3>
                My Apartment
              </h3>

              <p>
                Apartment info
                will be here
              </p>
            </div>

            <div style={cardStyle}>
              <h3>
                Announcements
              </h3>

              <p>
                Building news board
              </p>
            </div>

            <div style={cardStyle}>
              <h3>
                Building Chat
              </h3>

              <p>
                Chat system coming soon
              </p>
            </div>

          </div>
        )}

        {/* USERS */}

        {screen === "users" && (
          <div>

            <h1>
              Users
            </h1>

            <table
              style={tableStyle}
            >

              <thead>
                <tr>
					<th>ID</th>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
                </tr>
              </thead>

              <tbody>

                {users.map((u) => (
                  <tr key={u.id}>
					<td>{u.id}</td>
					<td>{u.first_name}</td>
					<td>{u.last_name}</td>
					<td>{u.email}</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

        {/* APARTMENTS */}

        {screen === "apartments" && (
          <div>

            <h1>
              Apartments
            </h1>

            {apartments.map((a) => (

              <div
                key={a.id}
                style={cardStyle}
              >

                <h3>
                  Apartment #{a.number}
                </h3>

				<div
				  style={{
					display: "flex",
					justifyContent: "center",
					marginTop: 20,
					marginBottom: 20,
				  }}
				>

				  <table>
					<tbody>

					  <tr>
						<td style={labelStyle}>
						  Section:
						</td>
						<td>{a.section}</td>
					  </tr>

					  <tr>
						<td style={labelStyle}>
						  Floor:
						</td>
						<td>{a.floor}</td>
					  </tr>

					  <tr>
						<td style={labelStyle}>
						  Levels:
						</td>
						<td>{a.level_count}</td>
					  </tr>

					  <tr>
						<td style={labelStyle}>
						  Living Area:
						</td>
						<td>{a.living_area}</td>
					  </tr>

					  <tr>
						<td style={labelStyle}>
						  Heated Area:
						</td>
						<td>{a.heated_area}</td>
					  </tr>

					  <tr>
						<td style={labelStyle}>
						  Notes:
						</td>
						<td>{a.notes}</td>
					  </tr>

					</tbody>
				  </table>

				</div>

                <p>
                  Notes:
                  {" "}
                  {a.notes}
                </p>

                <hr />

                <strong>
                  Owners:
                </strong>

                <ul>
                  {a.owners?.map((o) => (
                    <li key={o.id}>
                      {o.first_name} {o.last_name}
                    </li>
                  ))}
                </ul>

                <strong>
                  Residents:
                </strong>

                <ul>
                  {a.residents?.map((r) => (
                    <li key={r.id}>
                      {r.first_name} {r.last_name}
                    </li>
                  ))}
                </ul>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

// =========================
// UI
// =========================

function MenuButton({
  title,
  onClick,
}) {

  return (
    <button
      onClick={onClick}
      style={menuButton}
    >
      {title}
    </button>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  borderRadius: 10,
  border: "1px solid #ccc",
};

const buttonStyle = {
  marginTop: 20,
  padding: 12,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  width: "100%",
};

const menuButton = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const activeButton = {
  ...menuButton,
  background: "#2563eb",
  color: "white",
};

const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 20,
  marginBottom: 20,
};

const labelStyle = {
  textAlign: "right",
  paddingRight: 20,
  fontWeight: "bold",
};

const tableStyle = {
  width: "100%",
  background: "white",
  borderCollapse: "collapse",
};