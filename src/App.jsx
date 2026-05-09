import { useEffect, useState } from "react";

const API =
  "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {

  // =====================================
  // AUTH
  // =====================================

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [me, setMe] = useState(null);

  // =====================================
  // LOGIN
  // =====================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================
  // UI
  // =====================================

  const [mode, setMode] = useState("resident");

  const [screen, setScreen] =
    useState("dashboard");

  // =====================================
  // DATA
  // =====================================

  const [users, setUsers] = useState([]);
  
  const [showCreateUser, setShowCreateUser] = useState(false);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [showCreateApartment, setShowCreateApartment] =
    useState(false);

  const [newApartment, setNewApartment] = useState({
    number: "",
    section: "",
    floor: "",
    level_count: 1,
    living_area: "",
    non_living_area: "",
    heated_area: "",
    notes: "",
  });

  const [apartments, setApartments] =
    useState([]);

  const [waterMeters, setWaterMeters] =
    useState([]);

  const [adminWater, setAdminWater] =
    useState([]);

  const [dashboard, setDashboard] =
    useState(null);

  // =====================================
  // API
  // =====================================

  const api = async (
    url,
    options = {}
  ) => {

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
  // CRUD FUNCTIONS
  // =========================

const createUser = async () => {

  const res = await api(
    "/api/admin/create-user",
    {
      method: "POST",

      body: JSON.stringify(newUser),
    }
  );

  if (res.ok) {

    alert("User created");

    setShowCreateUser(false);

    setNewUser({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    });

    loadUsers();

  } else {

    alert(
      res.error || "Create failed"
    );

  }
};

const createApartment = async () => {

  const res = await api(
    "/api/admin/create-apartment",
    {
      method: "POST",

      body: JSON.stringify(newApartment),
    }
  );

  if (res.ok) {

    alert("Apartment created");

    setShowCreateApartment(false);

    setNewApartment({
      number: "",
      section: "",
      floor: "",
      living_area: "",
      heated_area: "",
      level_count: 1,
      notes: "",
    });

    loadApartments();

  } else {

    alert(
      res.error || "Create failed"
    );

  }
};

  // =====================================
  // LOAD USER
  // =====================================

  useEffect(() => {

    if (!token) return;

    api("/api/me")
      .then((d) => {

        if (!d?.user) {
          logout();
          return;
        }

        setMe(d);

        const roles = d.roles || [];

        const hasResident =
          roles.includes("resident") ||
          roles.includes("owner");

        const hasAdmin =
          roles.includes("admin");

        if (hasResident) {
          setMode("resident");
        } else if (hasAdmin) {
          setMode("admin");
        }

      });

  }, [token]);

  // =====================================
  // LOADERS
  // =====================================

  const loadUsers = async () => {

    const d = await api(
      "/api/admin/users"
    );

    setUsers(Array.isArray(d) ? d : []);
  };

  const loadApartments = async () => {

    const d = await api(
      "/api/apartments/full"
    );

    setApartments(
      Array.isArray(d) ? d : []
    );
  };

  const loadMyWater = async () => {

    const d = await api(
      "/api/my-water-meters"
    );

    setWaterMeters(
      Array.isArray(d) ? d : []
    );
  };

  const loadAdminWater = async () => {

    const d = await api(
      "/api/admin/water-readings"
    );

    setAdminWater(
      Array.isArray(d) ? d : []
    );
  };

  const loadDashboard = async () => {

    const d = await api(
      "/api/admin/dashboard"
    );

    setDashboard(d);
  };

  // =====================================
  // SCREEN LOADERS
  // =====================================

  useEffect(() => {

    if (screen === "users") {
      loadUsers();
    }

    if (screen === "apartments") {
      loadApartments();
    }

    if (screen === "water") {
      loadMyWater();
    }

    if (screen === "water-admin") {
      loadAdminWater();
    }

    if (
      screen === "dashboard" &&
      mode === "admin"
    ) {
      loadDashboard();
    }

  }, [screen, mode]);

  // =====================================
  // LOGIN
  // =====================================

  const login = async () => {

    const res = await api(
      "/api/login",
      {
        method: "POST",

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!res?.token) {

      alert(
        res?.error || "Login failed"
      );

      return;
    }

    localStorage.setItem(
      "token",
      res.token
    );

    setToken(res.token);
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);

    setMe(null);

    setScreen("dashboard");
  };

  // =====================================
  // SUBMIT WATER
  // =====================================

  const submitReading = async (
    meterId,
    value
  ) => {

    if (!value) {
      alert("Enter value");
      return;
    }

    const r = await api(
      "/api/submit-water-reading",
      {
        method: "POST",

        body: JSON.stringify({
          meter_id: meterId,
          reading_value: Number(value),
        }),
      }
    );

    if (r.ok) {

      alert("Submitted");

      loadMyWater();

    } else {

      alert(
        r?.error || "Submit failed"
      );

    }
  };

  // =====================================
  // LOGIN SCREEN
  // =====================================

  if (!token || !me) {

    return (
      <div style={loginPage}>

        <div style={loginCard}>

          <h1>
            DžIKS IRLAVA 20
			<br>
			MVP Housing System
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

  // =====================================
  // ROLES
  // =====================================

  const roles = me.roles || [];

  const hasResident =
    roles.includes("resident") ||
    roles.includes("owner");

  const hasAdmin =
    roles.includes("admin");

  // =====================================
  // MAIN APP
  // =====================================

  return (
    <div style={layout}>

      {/* SIDEBAR */}

      <div style={sidebar}>

        <h2 style={sidebarTitle}>
          MVX System
        </h2>

        <div style={sidebarUser}>
          {me.user.first_name}
          {" "}
          {me.user.last_name}
        </div>

        {/* MODES */}

        <div style={modeBlock}>

          {hasResident && (
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
          )}

          {hasAdmin && (
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
          )}

        </div>

        <hr style={divider} />

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
              title="Water Meters"
              onClick={() =>
                setScreen("water")
              }
            />

            <MenuButton
              title="Invoices"
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
              title="Water Readings"
              onClick={() =>
                setScreen("water-admin")
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

          </>
        )}

        <div style={{ flex: 1 }} />

        <hr style={divider} />

        <button
          onClick={logout}
          style={buttonStyle}
        >
          Logout
        </button>

      </div>

      {/* CONTENT */}

      <div style={content}>

        {/* DASHBOARD */}

        {screen === "dashboard" && (

          <div>

            <h1>
              Welcome
            </h1>

            <p>
              Current mode:
              {" "}
              {mode.toUpperCase()}
            </p>

            {/* RESIDENT DASHBOARD */}

            {mode === "resident" && (
              <>

                <div style={cardStyle}>
                  <h3>
                    My Apartment
                  </h3>

                  <p>
                    Apartment info panel
                  </p>
                </div>

                <div style={cardStyle}>
                  <h3>
                    Announcements
                  </h3>

                  <p>
                    Building announcements
                  </p>
                </div>

                <div style={cardStyle}>
                  <h3>
                    Water Meters
                  </h3>

                  <p>
                    Last submitted readings
                  </p>
                </div>

              </>
            )}

            {/* ADMIN DASHBOARD */}

            {mode === "admin" && (
              <div style={dashboardGrid}>

                <DashboardCard
                  title="Apartments"
                  value={
                    dashboard?.apartments || 0
                  }
                />

                <DashboardCard
                  title="Users"
                  value={
                    dashboard?.users || 0
                  }
                />

                <DashboardCard
                  title="Meters"
                  value={
                    dashboard?.meters || 0
                  }
                />

                <DashboardCard
                  title="Readings"
                  value={
                    dashboard?.readings || 0
                  }
                />

              </div>
            )}

          </div>
        )}

        {/* USERS */}

        {screen === "users" && (

          <div>

            <h1>
              Users
            </h1>

			<button
			  onClick={() => setShowCreateUser(true)}
			  style={buttonStyle}
			>
			  Add User
			</button>

            <table style={tableStyle}>

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

			{showCreateUser && (

			  <div style={modalStyle}>

				<div style={modalContentStyle}>

				  <h2>Create User</h2>

				  <input
					placeholder="First Name"
					value={newUser.first_name}
					onChange={(e) =>
					  setNewUser({
						...newUser,
						first_name: e.target.value,
					  })
					}
					style={inputStyle}
				  />

				  <input
					placeholder="Last Name"
					value={newUser.last_name}
					onChange={(e) =>
					  setNewUser({
						...newUser,
						last_name: e.target.value,
					  })
					}
					style={inputStyle}
				  />

				  <input
					placeholder="Email"
					value={newUser.email}
					onChange={(e) =>
					  setNewUser({
						...newUser,
						email: e.target.value,
					  })
					}
					style={inputStyle}
				  />

				  <input
					type="password"
					placeholder="Password"
					value={newUser.password}
					onChange={(e) =>
					  setNewUser({
						...newUser,
						password: e.target.value,
					  })
					}
					style={inputStyle}
				  />

				  <button
					onClick={createUser}
					style={buttonStyle}
				  >
					Save User
				  </button>

				  <button
					onClick={() =>
					  setShowCreateUser(false)
					}
					style={menuButton}
				  >
					Cancel
				  </button>

				</div>

			  </div>
			)}

          </div>
        )}

        {/* APARTMENTS */}

        {screen === "apartments" && (

          <div>

            <h1>
              Apartments
            </h1>

			<button
			  onClick={() =>
				setShowCreateApartment(true)
			  }
			  style={buttonStyle}
			>
			  Add Apartment
			</button>

            {apartments.map((a) => (

              <div
                key={a.id}
                style={cardStyle}
              >

                <h3>
                  Apartment #{a.number}
                </h3>

                <table
                  style={{
                    margin: "0 auto",
                  }}
                >
                  <tbody>

                    <InfoRow
                      label="Section"
                      value={a.section}
                    />

                    <InfoRow
                      label="Floor"
                      value={a.floor}
                    />

                    <InfoRow
                      label="Levels"
                      value={a.level_count}
                    />

                    <InfoRow
                      label="Living Area"
                      value={a.living_area}
                    />

                    <InfoRow
                      label="Heated Area"
                      value={a.heated_area}
                    />

                    <InfoRow
                      label="Notes"
                      value={a.notes}
                    />

                  </tbody>
                </table>

                <hr />

                <strong>
                  Owners
                </strong>

                <ul>
                  {a.owners?.map((o) => (
                    <li key={o.id}>
                      {o.first_name}
                      {" "}
                      {o.last_name}
                    </li>
                  ))}
                </ul>

                <strong>
                  Residents
                </strong>

                <ul>
                  {a.residents?.map((r) => (
                    <li key={r.id}>
                      {r.first_name}
                      {" "}
                      {r.last_name}
                    </li>
                  ))}
                </ul>



              </div>
            ))}

            {showCreateApartment && (

              <div style={modalStyle}>

                <div style={modalContentStyle}>

                  <h2>Create Apartment</h2>

                  <input
                    placeholder="Number"
                    value={newApartment.number}
                    onChange={(e) =>
                      setNewApartment({
                        ...newApartment,
                        number: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />

                  <input
                    placeholder="Section"
                    value={newApartment.section}
                    onChange={(e) =>
                      setNewApartment({
                        ...newApartment,
                        section: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />

                  <input
                    placeholder="Floor"
                    value={newApartment.floor}
                    onChange={(e) =>
                      setNewApartment({
                        ...newApartment,
                        floor: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />

                  <input
                    placeholder="Levels"
                    value={newApartment.level_count}
                    onChange={(e) =>
                      setNewApartment({
                        ...newApartment,
                        level_count: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />

                  <input
                    placeholder="Living Area"
                    value={newApartment.living_area}
                    onChange={(e) =>
                      setNewApartment({
                        ...newApartment,
                        living_area: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />

                  <textarea
                    placeholder="Notes"
                    value={newApartment.notes}
                    onChange={(e) =>
                      setNewApartment({
                        ...newApartment,
                        notes: e.target.value,
                      })
                    }
                    style={{
                      ...inputStyle,
                      minHeight: 100,
                    }}
                  />

                  <button
                    onClick={createApartment}
                    style={buttonStyle}
                  >
                    Save Apartment
                  </button>

                  <button
                    onClick={() =>
                      setShowCreateApartment(false)
                    }
                    style={menuButton}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

          </div>
        )}

        {/* RESIDENT WATER */}

        {screen === "water" && (

          <div>

            <h1>
              Water Meters
            </h1>

            {waterMeters.map((m) => (

              <WaterCard
                key={m.id}
                meter={m}
                onSubmit={submitReading}
              />

            ))}

          </div>
        )}

        {/* ADMIN WATER */}

        {screen === "water-admin" && (

          <div>

            <h1>
              Water Readings
            </h1>

            <table style={tableStyle}>

              <thead>
                <tr>
                  <th>Apartment</th>
                  <th>Type</th>
                  <th>Serial</th>
                  <th>Value</th>
                  <th>Date</th>
                  <th>User</th>
                </tr>
              </thead>

              <tbody>

                {adminWater.map((r, i) => (

                  <tr key={i}>

                    <td>
                      {r.apartment_number}
                    </td>

                    <td>
                      {r.type}
                    </td>

                    <td>
                      {r.serial_number}
                    </td>

                    <td>
                      {r.reading_value}
                    </td>

                    <td>
                      {r.reading_date}
                    </td>

                    <td>
                      {r.first_name}
                      {" "}
                      {r.last_name}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

// =====================================
// COMPONENTS
// =====================================

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

function DashboardCard({
  title,
  value,
}) {

  return (
    <div style={dashboardCard}>
      <h3>{title}</h3>

      <div
        style={{
          fontSize: 36,
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}) {

  return (
    <tr>
      <td style={labelStyle}>
        {label}:
      </td>

      <td>
        {value}
      </td>
    </tr>
  );
}

function WaterCard({
  meter,
  onSubmit,
}) {

  const [value, setValue] =
    useState("");

  return (
    <div style={cardStyle}>

      <h3>
        Apartment #
        {meter.apartment_number}
      </h3>

      <p>
        Type:
        {" "}
        {meter.type}
      </p>

      <p>
        Serial:
        {" "}
        {meter.serial_number}
      </p>

      <p>
        Last Reading:
        {" "}
        {meter.last_reading}
      </p>

      <p>
        Last Date:
        {" "}
        {meter.last_date}
      </p>

      <input
        placeholder="New reading"
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        style={inputStyle}
      />

      <button
        style={buttonStyle}
        onClick={() =>
          onSubmit(meter.id, value)
        }
      >
        Submit
      </button>

    </div>
  );
}

// =====================================
// STYLES
// =====================================

const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#f3f4f6",
};

const sidebar = {
  width: 280,
  background: "#111827",
  color: "white",
  padding: 20,
  display: "flex",
  flexDirection: "column",
};

const sidebarTitle = {
  color: "white",
};

const sidebarUser = {
  color: "#d1d5db",
  marginBottom: 20,
};

const divider = {
  borderColor: "#374151",
  width: "100%",
};

const modeBlock = {
  marginBottom: 20,
};

const content = {
  flex: 1,
  padding: 30,
};

const loginPage = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f3f4f6",
  padding: 20,
};

const loginCard = {
  background: "white",
  padding: 30,
  borderRadius: 20,
  width: "100%",
  maxWidth: 420,
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  borderRadius: 10,
  border: "1px solid #ccc",
  boxSizing: "border-box",
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

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
};

const dashboardCard = {
  background: "white",
  borderRadius: 20,
  padding: 30,
};

const modalStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalContentStyle = {
  background: "white",
  padding: 30,
  borderRadius: 20,
  width: "100%",
  maxWidth: 500,
};
