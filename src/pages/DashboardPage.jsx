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
  cardStyle,
} from "../styles/theme";

import useApartments
  from "../hooks/useApartments";

import useWater
  from "../hooks/useWater";

import {
  api,
} from "../services/api";

export default function DashboardPage() {

  const {
    mode,
  } = useMode();

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
    myApartments,
    setMyApartments
  ] = useState([]);

  const [
    residentLoading,
    setResidentLoading
  ] = useState(false);

  const [
    residentError,
    setResidentError
  ] = useState("");

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

    const loadResidentDashboard =
      async () => {

        setResidentLoading(true);
        setResidentError("");

        try {

          const [
            apartmentData,
          ] = await Promise.all([
            api(
              "/api/my-apartments"
            ),

            loadMyWater(),
          ]);

          if (
            apartmentData?.error
          ) {

            throw new Error(
              apartmentData.error
            );
          }

          setMyApartments(
            Array.isArray(
              apartmentData
            )
              ? apartmentData
              : []
          );

        } catch (error) {

          console.error(
            "Resident dashboard load failed:",
            error
          );

          setResidentError(
            "Resident dashboard data load failed"
          );

        } finally {

          setResidentLoading(false);
        }
      };

    loadResidentDashboard();

  }, [mode]);

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

  const residentWaterSummary =
    useMemo(
      () => {

        const activeMeters =
          waterMeters.filter(
            (meter) =>
              Number(
                meter.active ?? 1
              ) === 1
          );

        const coldMeters =
          activeMeters.filter(
            (meter) =>
              meter.type === "cold"
          );

        const hotMeters =
          activeMeters.filter(
            (meter) =>
              meter.type === "hot"
          );

        const metersWithReading =
          activeMeters.filter(
            (meter) =>
              meter.last_reading !==
                null &&
              meter.last_reading !==
                undefined
          );

        const dates =
          metersWithReading
            .map(
              (meter) =>
                meter.last_date
            )
            .filter(Boolean)
            .sort();

        return {
          total:
            activeMeters.length,

          cold:
            coldMeters.length,

          hot:
            hotMeters.length,

          withReading:
            metersWithReading.length,

          withoutReading:
            activeMeters.length -
            metersWithReading.length,

          latestDate:
            dates.length
              ? dates[
                  dates.length - 1
                ]
              : null,
        };
      },
      [waterMeters]
    );

  const dashboardSubtitle =
    mode === "resident"
      ? "Your apartment and utility overview"
      : "Building overview and statistics";

  return (
    <div>

      <div
        style={{
          marginBottom: 30,
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
          {dashboardSubtitle}
        </div>

      </div>

      {mode === "resident" && (

        <>

          {residentError && (

            <div
              style={{
                ...cardStyle,
                border:
                  "1px solid #fca5a5",
                background:
                  "#fee2e2",
                color:
                  "#991b1b",
              }}
            >
              {residentError}
            </div>

          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >

            <section
              style={{
                ...cardStyle,
                marginBottom: 0,
              }}
            >

              <DashboardSectionHeader
                title="My Apartment"
                subtitle={
                  myApartments.length ===
                    1
                    ? "Apartment information"
                    : `${myApartments.length} linked apartments`
                }
              />

              {residentLoading ? (

                <EmptyMessage>
                  Loading apartment data...
                </EmptyMessage>

              ) : myApartments.length ===
                0 ? (

                <EmptyMessage>
                  No apartment is linked
                  to your account.
                </EmptyMessage>

              ) : (

                <div
                  style={{
                    display: "grid",
                    gap: 12,
                  }}
                >

                  {myApartments.map(
                    (apartment) => (

                      <ApartmentSummary
                        key={
                          apartment.id
                        }
                        apartment={
                          apartment
                        }
                      />

                    )
                  )}

                </div>

              )}

            </section>

            <section
              onClick={() =>
                navigate("/water")
              }
              style={{
                ...cardStyle,
                marginBottom: 0,
                cursor: "pointer",
                transition:
                  "transform .15s ease, box-shadow .15s ease",
              }}
            >

              <DashboardSectionHeader
                title="Water Meters"
                subtitle="Open meter readings"
                action="View"
              />

              {residentLoading ? (

                <EmptyMessage>
                  Loading water meters...
                </EmptyMessage>

              ) : residentWaterSummary
                  .total === 0 ? (

                <EmptyMessage>
                  No active water meters
                  are linked to your
                  apartments.
                </EmptyMessage>

              ) : (

                <>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >

                    <Metric
                      label="Total"
                      value={
                        residentWaterSummary
                          .total
                      }
                    />

                    <Metric
                      label="Cold"
                      value={
                        residentWaterSummary
                          .cold
                      }
                    />

                    <Metric
                      label="Hot"
                      value={
                        residentWaterSummary
                          .hot
                      }
                    />

                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                    }}
                  >

                    <InfoLine
                      label="With reading"
                      value={
                        residentWaterSummary
                          .withReading
                      }
                    />

                    <InfoLine
                      label="Without reading"
                      value={
                        residentWaterSummary
                          .withoutReading
                      }
                    />

                    <InfoLine
                      label="Latest reading date"
                      value={
                        formatDate(
                          residentWaterSummary
                            .latestDate
                        )
                      }
                    />

                  </div>

                </>

              )}

            </section>

            <section
              style={{
                ...cardStyle,
                marginBottom: 0,
              }}
            >

              <DashboardSectionHeader
                title="Announcements"
                subtitle="Building news and notices"
              />

              <EmptyMessage>
                No announcements
              </EmptyMessage>

            </section>

          </div>

        </>

      )}

      {mode === "admin" && (

        <>

          <div
            style={{
              marginTop: 30,
              ...cardStyle,
            }}
          >

            <h2
              style={{
                marginTop: 0,
              }}
            >
              Building Summary
            </h2>

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                marginTop: 20,
              }}
            >

              <tbody>

                <SummaryRow
                  label="Apartments"
                  value={
                    dashboard?.stats
                      ?.apartments ||
                    0
                  }
                />

                <SummaryRow
                  label="Residents"
                  value={
                    dashboard?.stats
                      ?.users ||
                    0
                  }
                />

                <SummaryRow
                  label="Living Area"
                  value={
                    `${livingArea.toFixed(
                      2
                    )} ㎡`
                  }
                />

                <SummaryRow
                  label="Non Living Area"
                  value={
                    `${nonLivingArea.toFixed(
                      2
                    )} ㎡`
                  }
                />

                <SummaryRow
                  label="Heated Area"
                  value={
                    `${heatedArea.toFixed(
                      2
                    )} ㎡`
                  }
                />

                <SummaryRow
                  label="Land Tax Area"
                  value="—"
                />

                <SummaryRow
                  label="Alternative Heating Area"
                  value="—"
                />

                <SummaryRow
                  label="Water Readings (last month)"
                  value="—"
                />

              </tbody>

            </table>

          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(350px,1fr))",
              gap: 20,
              marginTop: 20,
            }}
          >

            <div style={cardStyle}>
              <h3>Announcements</h3>
              <p>No announcements</p>
            </div>

            <div style={cardStyle}>
              <h3>Repair Tickets</h3>
              <p>No open tickets</p>
            </div>

            <div style={cardStyle}>
              <h3>Projects</h3>
              <p>No active projects</p>
            </div>

            <div style={cardStyle}>
              <h3>Water Monitoring</h3>
              <p>
                Monitoring module coming
                soon
              </p>
            </div>

            <div style={cardStyle}>
              <h3>Recent Activity</h3>
              <p>No recent activity</p>
            </div>

          </div>

        </>

      )}

    </div>
  );
}

function DashboardSectionHeader({
  title,
  subtitle,
  action,
}) {

  return (
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
          }}
        >
          {title}
        </h3>

        <div
          style={{
            marginTop: 4,
            color:
              "var(--text)",
            fontSize: 12,
          }}
        >
          {subtitle}
        </div>

      </div>

      {action && (

        <span
          style={{
            color:
              "var(--accent)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {action} →
        </span>

      )}

    </div>
  );
}

function ApartmentSummary({
  apartment,
}) {

  const areas = [
    [
      "Living area",
      formatArea(
        apartment.living_area
      ),
    ],
    [
      "Heated area",
      formatArea(
        apartment.heated_area
      ),
    ],
  ];

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
          alignItems:
            "center",
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
          relation={
            apartment.relation_type
          }
        />

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: 8,
        }}
      >

        <InfoBox
          label="Section"
          value={
            apartment.section ??
            "—"
          }
        />

        <InfoBox
          label="Floor"
          value={
            apartment.floor ??
            "—"
          }
        />

        <InfoBox
          label="Rooms"
          value={
            apartment.room_count ??
            "—"
          }
        />

        <InfoBox
          label="Residents"
          value={
            apartment.residents_count ??
            "—"
          }
        />

      </div>

      <div
        style={{
          display: "grid",
          gap: 7,
          marginTop: 12,
          paddingTop: 12,
          borderTop:
            "1px solid var(--border)",
        }}
      >

        {areas.map(
          ([
            label,
            value,
          ]) => (

            <InfoLine
              key={label}
              label={label}
              value={value}
            />

          )
        )}

      </div>

    </div>
  );
}

function Metric({
  label,
  value,
}) {

  return (
    <div
      style={{
        padding: 12,
        border:
          "1px solid var(--border)",
        borderRadius: 11,
        background:
          "var(--surface-soft)",
        textAlign: "center",
      }}
    >

      <div
        style={{
          color:
            "var(--text)",
          fontSize: 10,
          fontWeight: 700,
          textTransform:
            "uppercase",
          letterSpacing: ".05em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 5,
          color:
            "var(--text-h)",
          fontSize: 24,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        {value}
      </div>

    </div>
  );
}

function InfoBox({
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
        alignItems:
          "baseline",
        gap: 12,
      }}
    >

      <span
        style={{
          color:
            "var(--text)",
          fontSize: 12,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color:
            "var(--text-h)",
          fontSize: 12,
          textAlign: "right",
        }}
      >
        {value}
      </strong>

    </div>
  );
}

function RelationBadge({
  relation,
}) {

  const owner =
    relation === "owner";

  return (
    <span
      style={{
        padding: "5px 9px",
        borderRadius: 999,
        background:
          owner
            ? "#dbeafe"
            : "#f3f4f6",
        color:
          owner
            ? "#1d4ed8"
            : "#374151",
        fontSize: 10,
        fontWeight: 700,
        textTransform:
          "capitalize",
      }}
    >
      {relation ||
        "resident"}
    </span>
  );
}

function EmptyMessage({
  children,
}) {

  return (
    <div
      style={{
        padding: 16,
        border:
          "1px dashed var(--border)",
        borderRadius: 11,
        color:
          "var(--text)",
        fontSize: 13,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
}) {

  return (
    <tr>

      <td
        style={{
          padding: "10px 0",
        }}
      >
        {label}
      </td>

      <td>
        <strong>
          {value}
        </strong>
      </td>

    </tr>
  );
}

function formatArea(
  value
) {

  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return "—";
  }

  return `${number.toFixed(
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
