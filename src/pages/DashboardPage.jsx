import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import useDashboard
  from "../hooks/useDashboard";

import {
  useMode,
} from "../context/ModeContext";

import {
  useAuth,
} from "../context/AuthContext";

import useApartments
  from "../hooks/useApartments";

import useWater
  from "../hooks/useWater";

import {
  api,
} from "../services/api";

import Drawer
  from "../components/Drawer";

import {
  cardStyle,
} from "../styles/theme";

const CONTACTS = [
  {
    role: "Pārvaldnieks",
    name: "Jevgēnijs Anosovs",
    phone: "+371 29228047",
  },
  {
    role: "Grāmatvede",
    name: "Maija Malmigo",
    phone: "+371 2983923",
  },
  {
    role: "Siltumtehniķis",
    name: "Igors Guļko",
    phone: "+371 28218233",
  },
];

export default function DashboardPage() {

  const {
    mode,
  } = useMode();

  const {
    me,
  } = useAuth();

  const navigate =
    useNavigate();

  const {
    dashboard,
    loadDashboard,
  } = useDashboard();

  const {
    apartments,
    loadApartments,
  } = useApartments();

  const {
    waterMeters,
    loadMyWater,
  } = useWater();

  const [
    apartmentRows,
    setApartmentRows
  ] = useState([]);

  const [
    residentLoading,
    setResidentLoading
  ] = useState(false);

  const [
    apartmentOpen,
    setApartmentOpen
  ] = useState(false);

  const [
    contactsOpen,
    setContactsOpen
  ] = useState(false);

  useEffect(() => {

    if (mode === "admin") {

      loadDashboard();
      loadApartments();
    }

  }, [mode]);

  useEffect(() => {

    if (mode !== "resident") {
      return;
    }

    const loadResident =
      async () => {

        setResidentLoading(true);

        try {

          const [
            result,
          ] = await Promise.all([
            api(
              "/api/my-apartments"
            ),

            loadMyWater(),
          ]);

          setApartmentRows(
            Array.isArray(result)
              ? result
              : []
          );

        } finally {

          setResidentLoading(false);
        }
      };

    loadResident();

  }, [mode]);

  const myApartments =
    useMemo(
      () =>
        mergeApartments(
          apartmentRows
        ),
      [apartmentRows]
    );

  const waterSummary =
    useMemo(
      () =>
        buildWaterSummary(
          waterMeters
        ),
      [waterMeters]
    );

  const userName =
    [
      me?.user?.first_name,
      me?.user?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Resident";

  const livingArea =
    apartments.reduce(
      (
        sum,
        apartment
      ) =>
        sum +
        Number(
          apartment.living_area ||
          0
        ),
      0
    );

  const nonLivingArea =
    apartments.reduce(
      (
        sum,
        apartment
      ) =>
        sum +
        Number(
          apartment.non_living_area ||
          0
        ),
      0
    );

  const heatedArea =
    apartments.reduce(
      (
        sum,
        apartment
      ) =>
        sum +
        Number(
          apartment.heated_area ||
          0
        ),
      0
    );

  return (
    <div>

      <div
        style={{
          marginBottom: 24,
        }}
      >

        <h1
          style={{
            marginBottom: 6,
          }}
        >
          Dashboard
        </h1>

        <div
          style={{
            color:
              "var(--text)",
          }}
        >
          {mode === "resident"
            ? "Your home at a glance"
            : "Building overview and statistics"}
        </div>

      </div>

      {mode === "resident" && (

        <>

          <div
            className="resident-home-grid"
          >

            <HomeTile
              title="My Apartment"
              subtitle="Profile and home information"
              accent="#2563eb"
              wide
              onClick={() =>
                setApartmentOpen(true)
              }
            >

              {residentLoading ? (

                <Placeholder>
                  Loading...
                </Placeholder>

              ) : myApartments.length ===
                0 ? (

                <Placeholder>
                  No apartment linked.
                </Placeholder>

              ) : (

                <>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >

                    <div>

                      <div
                        style={{
                          color:
                            "var(--text-h)",
                          fontSize: 24,
                          fontWeight: 800,
                        }}
                      >
                        {formatApartmentTitle(
                          myApartments
                        )}
                      </div>

                      <div
                        style={{
                          marginTop: 5,
                          color:
                            "var(--text)",
                          fontSize: 13,
                        }}
                      >
                        {userName}
                      </div>

                    </div>

                    <RelationBadge
                      relations={
                        collectRelations(
                          myApartments
                        )
                      }
                    />

                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginTop: 14,
                    }}
                  >

                    {myApartments.map(
                      (apartment) => (

                        <span
                          key={apartment.id}
                          style={pillStyle}
                        >
                          Section{" "}
                          {apartment.section ??
                            "—"}
                          {" · "}
                          Floor{" "}
                          {apartment.floor ??
                            "—"}
                        </span>

                      )
                    )}

                  </div>

                </>

              )}

            </HomeTile>

            <HomeTile
              title="Readings"
              subtitle="Water readings overview"
              accent="#0891b2"
              onClick={() =>
                navigate("/water")
              }
            >

              {residentLoading ? (

                <Placeholder>
                  Loading...
                </Placeholder>

              ) : (

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                  }}
                >

                  <ReadingRow
                    label="Cold Water"
                    value={
                      formatReading(
                        waterSummary.cold
                      )
                    }
                  />

                  <ReadingRow
                    label="Hot Water"
                    value={
                      formatReading(
                        waterSummary.hot
                      )
                    }
                  />

                  <InfoLine
                    label="Latest reading"
                    value={
                      formatDate(
                        waterSummary.latestDate
                      )
                    }
                  />

                </div>

              )}

            </HomeTile>

            <HomeTile
              title="Announcements"
              subtitle="Building news and notices"
              accent="#d97706"
            >

              <Placeholder>
                <strong
                  style={{
                    display: "block",
                    marginBottom: 5,
                    color:
                      "var(--text-h)",
                  }}
                >
                  Everything is up to date
                </strong>

                No new announcements.
              </Placeholder>

            </HomeTile>

            <HomeTile
              title="Contact Administration"
              subtitle="DzĪKS IRLAVA 20 contacts"
              accent="#7c3aed"
              wide
              onClick={() =>
                setContactsOpen(true)
              }
            >

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(170px,1fr))",
                  gap: 10,
                }}
              >

                {CONTACTS.map(
                  (contact) => (

                    <div
                      key={contact.role}
                      style={contactPreview}
                    >

                      <div
                        style={{
                          color:
                            "var(--text)",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {contact.role}
                      </div>

                      <div
                        style={{
                          marginTop: 4,
                          color:
                            "var(--text-h)",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {contact.name}
                      </div>

                    </div>

                  )
                )}

              </div>

            </HomeTile>

          </div>

          <Drawer
            open={apartmentOpen}
            title="My Apartment"
            onClose={() =>
              setApartmentOpen(false)
            }
          >

            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >

              <div
                style={{
                  color:
                    "var(--text-h)",
                  fontSize: 20,
                  fontWeight: 800,
                }}
              >
                {userName}
              </div>

              {myApartments.map(
                (apartment) => (

                  <ApartmentDetails
                    key={apartment.id}
                    apartment={
                      apartment
                    }
                  />

                )
              )}

            </div>

          </Drawer>

          <Drawer
            open={contactsOpen}
            title="Contact Administration"
            onClose={() =>
              setContactsOpen(false)
            }
          >

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >

              {CONTACTS.map(
                (contact) => (

                  <ContactCard
                    key={contact.role}
                    contact={contact}
                  />

                )
              )}

            </div>

          </Drawer>

        </>

      )}

      {mode === "admin" && (

        <AdminDashboard
          dashboard={dashboard}
          livingArea={livingArea}
          nonLivingArea={
            nonLivingArea
          }
          heatedArea={heatedArea}
        />

      )}

    </div>
  );
}

function HomeTile({
  title,
  subtitle,
  accent,
  wide = false,
  onClick,
  children,
}) {

  const clickable =
    typeof onClick ===
    "function";

  return (
    <section
      onClick={onClick}
      role={
        clickable
          ? "button"
          : undefined
      }
      tabIndex={
        clickable
          ? 0
          : undefined
      }
      style={{
        ...tileStyle,
        gridColumn:
          wide
            ? "span 2"
            : "span 1",
        borderTop:
          `4px solid ${accent}`,
        cursor:
          clickable
            ? "pointer"
            : "default",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap: 12,
          marginBottom: 16,
        }}
      >

        <div>

          <h3
            style={{
              margin: 0,
              color:
                "var(--text-h)",
              fontSize: 17,
            }}
          >
            {title}
          </h3>

          <div
            style={{
              marginTop: 3,
              color:
                "var(--text)",
              fontSize: 11,
            }}
          >
            {subtitle}
          </div>

        </div>

        {clickable && (

          <span
            style={{
              color: accent,
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            →
          </span>

        )}

      </div>

      {children}

    </section>
  );
}

function ReadingRow({
  label,
  value,
}) {

  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        gap: 12,
        padding: 11,
        border:
          "1px solid var(--border)",
        borderRadius: 10,
        background:
          "var(--surface-soft)",
      }}
    >

      <span
        style={{
          color:
            "var(--text-h)",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color:
            "var(--text-h)",
          fontSize: 16,
        }}
      >
        {value}
      </strong>

    </div>
  );
}

function ApartmentDetails({
  apartment,
}) {

  return (
    <div
      style={{
        padding: 14,
        border:
          "1px solid var(--border)",
        borderRadius: 12,
        background:
          "var(--surface-soft)",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: 10,
          marginBottom: 12,
        }}
      >

        <strong
          style={{
            color:
              "var(--text-h)",
            fontSize: 17,
          }}
        >
          Apartment #
          {apartment.number}
        </strong>

        <RelationBadge
          relations={
            apartment.relations
          }
        />

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2,minmax(0,1fr))",
          gap: 8,
        }}
      >

        <DetailBox
          label="Section"
          value={
            apartment.section ??
            "—"
          }
        />

        <DetailBox
          label="Floor"
          value={
            apartment.floor ??
            "—"
          }
        />

        <DetailBox
          label="Rooms"
          value={
            apartment.room_count ??
            "—"
          }
        />

        <DetailBox
          label="Residents"
          value={
            apartment.residents_count ??
            "—"
          }
        />

        <DetailBox
          label="Living area"
          value={
            formatArea(
              apartment.living_area
            )
          }
        />

        <DetailBox
          label="Heated area"
          value={
            formatArea(
              apartment.heated_area
            )
          }
        />

      </div>

    </div>
  );
}

function ContactCard({
  contact,
}) {

  return (
    <div
      style={{
        padding: 14,
        border:
          "1px solid var(--border)",
        borderRadius: 12,
        background:
          "var(--surface-soft)",
      }}
    >

      <div
        style={{
          color:
            "var(--text)",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {contact.role}
      </div>

      <div
        style={{
          marginTop: 5,
          color:
            "var(--text-h)",
          fontSize: 16,
          fontWeight: 800,
        }}
      >
        {contact.name}
      </div>

      <a
        href={`tel:${contact.phone.replace(
          /\s+/g,
          ""
        )}`}
        style={{
          display:
            "inline-flex",
          marginTop: 10,
          padding: "9px 12px",
          borderRadius: 9,
          background: "#2563eb",
          color: "#ffffff",
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        ☎ {contact.phone}
      </a>

    </div>
  );
}

function RelationBadge({
  relations = [],
}) {

  const label =
    relations
      .map(
        (relation) =>
          relation === "owner"
            ? "Owner"
            : relation === "resident"
              ? "Resident"
              : relation
      )
      .join(" / ") ||
    "Resident";

  return (
    <span
      style={{
        padding: "5px 9px",
        borderRadius: 999,
        background: "#dbeafe",
        color: "#1d4ed8",
        fontSize: 10,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function DetailBox({
  label,
  value,
}) {

  return (
    <div
      style={{
        padding: 10,
        borderRadius: 9,
        background:
          "var(--surface)",
      }}
    >

      <div
        style={{
          color:
            "var(--text)",
          fontSize: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 3,
          color:
            "var(--text-h)",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {value}
      </div>

    </div>
  );
}

function Placeholder({
  children,
}) {

  return (
    <div
      style={{
        padding: 16,
        border:
          "1px dashed var(--border)",
        borderRadius: 10,
        color:
          "var(--text)",
        fontSize: 12,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

function InfoLine({
  label,
  value,
}) {

  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        gap: 12,
        paddingTop: 8,
        borderTop:
          "1px solid var(--border)",
      }}
    >

      <span
        style={{
          color:
            "var(--text)",
          fontSize: 11,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color:
            "var(--text-h)",
          fontSize: 11,
        }}
      >
        {value}
      </strong>

    </div>
  );
}

function AdminDashboard({
  dashboard,
  livingArea,
  nonLivingArea,
  heatedArea,
}) {

  return (
    <div style={cardStyle}>

      <h2
        style={{
          marginTop: 0,
        }}
      >
        Building Summary
      </h2>

      <InfoLine
        label="Apartments"
        value={
          dashboard?.stats
            ?.apartments ||
          0
        }
      />

      <InfoLine
        label="Residents"
        value={
          dashboard?.stats
            ?.users ||
          0
        }
      />

      <InfoLine
        label="Living Area"
        value={
          `${livingArea.toFixed(
            2
          )} ㎡`
        }
      />

      <InfoLine
        label="Non Living Area"
        value={
          `${nonLivingArea.toFixed(
            2
          )} ㎡`
        }
      />

      <InfoLine
        label="Heated Area"
        value={
          `${heatedArea.toFixed(
            2
          )} ㎡`
        }
      />

    </div>
  );
}

function mergeApartments(
  rows
) {

  const map =
    new Map();

  rows.forEach(
    (row) => {

      const key =
        String(
          row.id ??
          row.apartment_id ??
          row.number
        );

      if (!map.has(key)) {

        map.set(
          key,
          {
            ...row,
            relations: [],
          }
        );
      }

      const item =
        map.get(key);

      const relation =
        row.relation_type ||
        row.relation ||
        row.user_relation;

      if (
        relation &&
        !item.relations.includes(
          relation
        )
      ) {

        item.relations.push(
          relation
        );
      }
    }
  );

  return Array.from(
    map.values()
  );
}

function collectRelations(
  apartments
) {

  return Array.from(
    new Set(
      apartments.flatMap(
        (apartment) =>
          apartment.relations
      )
    )
  );
}

function buildWaterSummary(
  meters
) {

  const active =
    meters.filter(
      (meter) =>
        Number(
          meter.active ?? 1
        ) === 1
    );

  const sumByType =
    (type) =>
      active
        .filter(
          (meter) =>
            meter.type === type
        )
        .reduce(
          (
            sum,
            meter
          ) =>
            sum +
            (
              Number(
                meter.last_reading
              ) ||
              0
            ),
          0
        );

  const dates =
    active
      .map(
        (meter) =>
          meter.last_date
      )
      .filter(Boolean)
      .sort();

  return {
    cold:
      sumByType("cold"),

    hot:
      sumByType("hot"),

    latestDate:
      dates.length
        ? dates[
            dates.length - 1
          ]
        : null,
  };
}

function formatApartmentTitle(
  apartments
) {

  return apartments.length === 1
    ? `Apartment #${apartments[0].number}`
    : apartments
        .map(
          (apartment) =>
            `#${apartment.number}`
        )
        .join(", ");
}

function formatReading(
  value
) {

  const numeric =
    Number(value);

  if (
    !Number.isFinite(
      numeric
    )
  ) {
    return "—";
  }

  return (
    (numeric / 1000)
      .toFixed(3)
      .replace(".", ",") +
    " m³"
  );
}

function formatArea(
  value
) {

  const numeric =
    Number(value);

  if (
    !Number.isFinite(
      numeric
    )
  ) {
    return "—";
  }

  return `${numeric.toFixed(
    2
  )} ㎡`;
}

function formatDate(
  value
) {

  if (!value) {
    return "—";
  }

  return String(value)
    .slice(0, 10);
}

const tileStyle = {
  minWidth: 0,
  padding: 18,
  border:
    "1px solid var(--border)",
  borderRadius: 16,
  background:
    "var(--surface)",
  boxShadow:
    "0 8px 24px rgba(15,23,42,.06)",
  boxSizing: "border-box",
};

const pillStyle = {
  display: "inline-block",
  padding: "6px 9px",
  borderRadius: 999,
  background:
    "var(--surface-soft)",
  color:
    "var(--text-h)",
  fontSize: 10,
  fontWeight: 700,
};

const contactPreview = {
  padding: 10,
  border:
    "1px solid var(--border)",
  borderRadius: 10,
  background:
    "var(--surface-soft)",
};
