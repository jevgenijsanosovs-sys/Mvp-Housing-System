import {
  useEffect,
  useMemo,
  useState,
} from "react";

const API =
  "https://noisy-band-27a3.jevgenijs-anosovs.workers.dev";

export default function App() {
  // =====================================================
  // AUTH
  // =====================================================

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);

  // =====================================================
  // APP
  // =====================================================

  const [activeContext, setActiveContext] =
    useState("resident");

  const [section, setSection] =
    useState("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  // =====================================================
  // DATA
  // =====================================================

  const [users, setUsers] = useState([]);
  const [apartments, setApartments] =
    useState([]);

  // =====================================================
  // RESPONSIVE
  // =====================================================

  const [mobile, setMobile] =
    useState(window.innerWidth < 900);

  useEffect(() => {
    const onResize = () => {
      setMobile(window.innerWidth < 900);
    };

    window.addEventListener(
      "resize",
      onResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        onResize
      );
  }, []);

  // =====================================================
  // API
  // =====================================================

  const api = async (
    url,
    options = {}
  ) => {
    const res = await fetch(API + url, {
      ...options,
      headers: {
        "Content-Type":
          "application/json",

        ...(token
          ? {
              Authorization:
                "Bearer " + token,
            }
          : {}),

        ...(options.headers || {}),
      },
    });

    return await res.json();
  };

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    if (!token) return;

    loadMe();
  }, [token]);

  const loadMe = async () => {
    const data = await api("/api/me");

    if (data?.user) {
      setUser(data);

      if (
        data.roles?.includes("admin")
      ) {
        setActiveContext("admin");
      } else if (
        data.roles?.includes("worker")
      ) {
        setActiveContext("worker");
      } else if (
        data.roles?.includes(
          "accountant"
        )
      ) {
        setActiveContext(
          "accountant"
        );
      } else {
        setActiveContext("resident");
      }
    }
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async () => {
    const data = await api(
      "/api/login",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (data?.token) {
      localStorage.setItem(
        "token",
        data.token
      );

      setToken(data.token);
    } else {
      alert(
        data?.error ||
          "Login failed"
      );
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    setToken(null);
    setUser(null);

    setSection("dashboard");

    setActiveContext(
      "resident"
    );
  };

  // =====================================================
  // LOAD ADMIN
  // =====================================================

  useEffect(() => {
    if (!token) return;

    if (
      activeContext === "admin"
    ) {
      loadAdminData();
    }
  }, [activeContext]);

  const loadAdminData =
    async () => {
      const u = await api(
        "/api/admin/users"
      );

      const a = await api(
        "/api/admin/apartments"
      );

      setUsers(
        Array.isArray(u) ? u : []
      );

      setApartments(
        Array.isArray(a) ? a : []
      );
    };

  // =====================================================
  // CONTEXTS
  // =====================================================

  const availableContexts =
    useMemo(() => {
      if (!user?.roles) return [];

      const result = [];

      if (
        user.roles.includes(
          "owner"
        ) ||
        user.roles.includes(
          "resident"
        )
      ) {
        result.push(
          "resident"
        );
      }

      if (
        user.roles.includes(
          "admin"
        )
      ) {
        result.push("admin");
      }

      if (
        user.roles.includes(
          "worker"
        )
      ) {
        result.push("worker");
      }

      if (
        user.roles.includes(
          "accountant"
        )
      ) {
        result.push(
          "accountant"
        );
      }

      return result;
    }, [user]);

  // =====================================================
  // SIDEBAR
  // =====================================================

  const sidebarItems =
    useMemo(() => {
      // =====================
      // RESIDENT
      // =====================

      if (
        activeContext ===
        "resident"
      ) {
        return [
          [
            "dashboard",
            "Dashboard",
          ],
          [
            "apartment",
            "My Apartment",
          ],
          [
            "tickets",
            "My Tickets",
          ],
          [
            "invoices",
            "Invoices",
          ],
          [
            "announcements",
            "Announcements",
          ],
          ["chat", "Chat"],
          [
            "documents",
            "Documents",
          ],
        ];
      }

      // =====================
      // ADMIN
      // =====================

      if (
        activeContext ===
        "admin"
      ) {
        return [
          [
            "dashboard",
            "Dashboard",
          ],
          [
            "tickets-admin",
            "Tickets Control",
          ],
          [
            "apartments",
            "Apartments",
          ],
          ["users", "Users"],
          [
            "workers",
            "Workers",
          ],
          [
            "contractors",
            "Contractors",
          ],
          [
            "documents-admin",
            "Documentation",
          ],
        ];
      }

      // =====================
      // WORKER
      // =====================

      if (
        activeContext ===
        "worker"
      ) {
        return [
          [
            "dashboard",
            "Dashboard",
          ],
          [
            "tickets-worker",
            "Assigned Tickets",
          ],
          [
            "schedule",
            "Schedule",
          ],
          [
            "completed",
            "Completed",
          ],
        ];
      }

      // =====================
      // ACCOUNTANT
      // =====================

      if (
        activeContext ===
        "accountant"
      ) {
        return [
          [
            "dashboard",
            "Dashboard",
          ],
          [
            "invoices-admin",
            "Invoices",
          ],
          [
            "payments",
            "Payments",
          ],
          [
            "reports",
            "Reports",
          ],
        ];
      }

      return [];
    }, [activeContext]);

  // =====================================================
  // LOGIN SCREEN
  // =====================================================

  if (!token) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
          background: "#f3f4f6",
          fontFamily: "Arial",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "white",
            width: "100%",
            maxWidth: 420,
            borderRadius: 14,
            padding: 30,
            boxShadow:
              "0 0 25px rgba(0,0,0,0.08)",
          }}
        >
          <h1>
            MVP Housing
          </h1>

          <p>
            Residential Management
            Platform
          </p>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <button
            onClick={login}
            style={primaryButton}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN APP
  // =====================================================

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial",
      }}
    >
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobile &&
        sidebarOpen && (
          <div
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.5)",
              zIndex: 10,
            }}
          />
        )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div
        style={{
          width: 260,

          background:
            "#111827",

          color: "white",

          padding: 20,

          position: mobile
            ? "fixed"
            : "relative",

          left:
            mobile &&
            !sidebarOpen
              ? -280
              : 0,

          top: 0,

          height: "100vh",

          transition:
            "0.25s",

          zIndex: 20,

          overflowY: "auto",
        }}
      >
        <h2>
          MVP Housing
        </h2>

        <hr />

        {/* ==========================================
            USER
        ========================================== */}

        <div
          style={{
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 12,
              opacity: 0.7,
            }}
          >
            USER
          </div>

          <div>
            {
              user?.user
                ?.email
            }
          </div>
        </div>

        {/* ==========================================
            CONTEXT SWITCHER
        ========================================== */}

        <div
          style={{
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 12,
              opacity: 0.7,
              marginBottom: 6,
            }}
          >
            ACTIVE MODE
          </div>

          <select
            value={
              activeContext
            }
            onChange={(e) =>
              setActiveContext(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 10,
            }}
          >
            {availableContexts.map(
              (c) => (
                <option
                  key={c}
                  value={c}
                >
                  {c.toUpperCase()}
                </option>
              )
            )}
          </select>
        </div>

        {/* ==========================================
            MENU
        ========================================== */}

        {sidebarItems.map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setSection(
                  key
                );

                if (
                  mobile
                ) {
                  setSidebarOpen(
                    false
                  );
                }
              }}
              style={{
                width: "100%",

                padding: 14,

                marginBottom: 8,

                textAlign:
                  "left",

                border: "none",

                cursor:
                  "pointer",

                borderRadius: 8,

                background:
                  section ===
                  key
                    ? "#374151"
                    : "transparent",

                color: "white",
              }}
            >
              {label}
            </button>
          )
        )}

        <hr />

        <button
          onClick={logout}
          style={{
            ...primaryButton,
            background:
              "#dc2626",
          }}
        >
          Logout
        </button>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        style={{
          flex: 1,
          overflow: "auto",
          background:
            "#f3f4f6",
        }}
      >
        {/* =====================================================
            TOPBAR
        ===================================================== */}

        <div
          style={{
            background:
              "white",

            padding: 16,

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            boxShadow:
              "0 1px 5px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 12,
            }}
          >
            {mobile && (
              <button
                onClick={() =>
                  setSidebarOpen(
                    true
                  )
                }
                style={{
                  fontSize: 24,
                  border:
                    "none",
                  background:
                    "transparent",
                  cursor:
                    "pointer",
                }}
              >
                ☰
              </button>
            )}

            <div>
              <div
                style={{
                  fontWeight:
                    "bold",
                }}
              >
                MVP Housing
              </div>

              <div
                style={{
                  fontSize: 12,
                  opacity: 0.7,
                }}
              >
                {
                  activeContext
                }{" "}
                mode
              </div>
            </div>
          </div>

          <div>
            {
              user?.user
                ?.email
            }
          </div>
        </div>

        {/* =====================================================
            PAGE
        ===================================================== */}

        <div
          style={{
            padding: mobile
              ? 16
              : 30,
          }}
        >
          {/* ==========================================
              DASHBOARD
          ========================================== */}

          {section ===
            "dashboard" && (
            <>
              <h1>
                {activeContext.toUpperCase()}{" "}
                DASHBOARD
              </h1>

              <ResponsiveGrid>
                <DashboardCard
                  title="Announcements"
                  text="Building announcements and updates."
                />

                <DashboardCard
                  title="Tickets"
                  text="Maintenance and repair requests."
                />

                <DashboardCard
                  title="Invoices"
                  text="Payments and billing."
                />

                <DashboardCard
                  title="Chat"
                  text="Residents communication."
                />
              </ResponsiveGrid>
            </>
          )}

          {/* ==========================================
              USERS
          ========================================== */}

          {section ===
            "users" && (
            <div>
              <h1>
                Users
              </h1>

              <ResponsiveGrid>
                {users.map(
                  (u) => (
                    <EntityCard
                      key={u.id}
                      title={
                        u.email
                      }
                    >
                      <div>
                        ID:{" "}
                        {u.id}
                      </div>
                    </EntityCard>
                  )
                )}
              </ResponsiveGrid>
            </div>
          )}

          {/* ==========================================
              APARTMENTS
          ========================================== */}

          {section ===
            "apartments" && (
            <div>
              <h1>
                Apartments
              </h1>

              <ResponsiveGrid>
                {apartments.map(
                  (a) => (
                    <EntityCard
                      key={a.id}
                      title={`Apartment ${a.number}`}
                    >
                      <div>
                        Floor:{" "}
                        {
                          a.floor
                        }
                      </div>

                      <div>
                        Residents:{" "}
                        {
                          a.residents_count
                        }
                      </div>
                    </EntityCard>
                  )
                )}
              </ResponsiveGrid>
            </div>
          )}

          {/* ==========================================
              PLACEHOLDERS
          ========================================== */}

          {![
            "dashboard",
            "users",
            "apartments",
          ].includes(
            section
          ) && (
            <EntityCard
              title={
                section
              }
            >
              <p>
                Module
                architecture
                ready.
              </p>

              <p>
                Backend
                integration
                coming next.
              </p>
            </EntityCard>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// RESPONSIVE GRID
// =====================================================

function ResponsiveGrid({
  children,
}) {
  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "repeat(auto-fit, minmax(280px, 1fr))",

        gap: 20,
      }}
    >
      {children}
    </div>
  );
}

// =====================================================
// DASHBOARD CARD
// =====================================================

function DashboardCard({
  title,
  text,
}) {
  return (
    <div
      style={{
        background: "white",

        padding: 24,

        borderRadius: 14,

        minHeight: 140,

        boxShadow:
          "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

// =====================================================
// ENTITY CARD
// =====================================================

function EntityCard({
  title,
  children,
}) {
  return (
    <div
      style={{
        background: "white",

        padding: 20,

        borderRadius: 14,

        boxShadow:
          "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h3>{title}</h3>

      {children}
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #d1d5db",
};

const primaryButton = {
  width: "100%",
  padding: 12,
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  background: "#2563eb",
  color: "white",
};