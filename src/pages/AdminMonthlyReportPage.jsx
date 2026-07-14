import { useEffect } from "react";

import useWater from "../hooks/useWater";

export default function AdminMonthlyReportPage() {

  const {

    currentWaterReportingPeriod,
    currentWaterReportingPeriodLoading,
    currentWaterReportingPeriodError,
    loadCurrentWaterReportingPeriod,

    adminMonthlyReport,
    adminMonthlyReportLoading,
    adminMonthlyReportError,
    loadAdminMonthlyReport,

  } = useWater();

  useEffect(() => {

    const loadReport = async () => {

      const periodData =
        await loadCurrentWaterReportingPeriod();

      const period =
        periodData?.period;

      if (
        !period?.period_year ||
        !period?.period_month
      ) {
        return;
      }

      await loadAdminMonthlyReport(
        period.period_year,
        period.period_month
      );
    };

    loadReport();

  }, []);

  const summary =
    adminMonthlyReport?.summary;

  const period =
    adminMonthlyReport?.period ||
    currentWaterReportingPeriod?.period;

  const missingApartments =
    Array.isArray(
      adminMonthlyReport
        ?.missing_apartments
    )
      ? adminMonthlyReport
          .missing_apartments
      : [];

  const isLoading =
    currentWaterReportingPeriodLoading ||
    adminMonthlyReportLoading;

  const errorMessage =
    currentWaterReportingPeriodError ||
    adminMonthlyReportError;

  const formatMonth = (
    year,
    month
  ) => {

    if (!year || !month) {
      return "—";
    }

    const date = new Date(
      Date.UTC(
        year,
        month - 1,
        1
      )
    );

    return date.toLocaleDateString(
      "en-GB",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (
    value
  ) => {

    if (!value) {
      return "—";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const formatConsumption = (
    value
  ) => {

    const storedValue =
      Number(value);

    if (
      !Number.isFinite(
        storedValue
      )
    ) {
      return "0,000 m³";
    }

    return (
      (storedValue / 1000)
        .toFixed(3)
        .replace(".", ",") +
      " m³"
    );
  };

  const formatStatus = (
    value
  ) => {

    if (!value) {
      return "Unknown";
    }

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1)
    );
  };

  const getStatusStyle = (
    status
  ) => {

    const normalizedStatus =
      String(status || "")
        .toLowerCase();

    if (
      normalizedStatus === "open"
    ) {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (
      normalizedStatus === "closed"
    ) {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (
      normalizedStatus ===
      "finalized"
    ) {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    return {
      background: "#f3f4f6",
      color: "#4b5563",
    };
  };

  return (
    <div>

      <div
        style={{
          marginBottom: 24,
        }}
      >

        <h1
          style={{
            margin: 0,
          }}
        >
          Monthly Report
        </h1>

        <p
          style={{
            marginTop: 8,
            marginBottom: 0,
            color: "#6b7280",
            lineHeight: 1.5,
          }}
        >
          Water meter collection
          status and monthly
          consumption summary.
        </p>

      </div>

      {isLoading && (

        <div
          style={{
            padding: 20,
            border:
              "1px solid #e5e7eb",
            borderRadius: 14,
            background: "#ffffff",
            color: "#6b7280",
          }}
        >
          Loading monthly report...
        </div>

      )}

      {!isLoading &&
        errorMessage && (

        <div
          style={{
            padding: 16,
            border:
              "1px solid #fecaca",
            borderRadius: 12,
            background: "#fef2f2",
            color: "#b91c1c",
          }}
        >
          {errorMessage}
        </div>

      )}

      {!isLoading &&
        !errorMessage &&
        adminMonthlyReport &&
        summary &&
        period && (

        <>

          <section
            style={{
              marginBottom: 20,
              padding: 18,
              border:
                "1px solid #e5e7eb",
              borderRadius: 16,
              background: "#ffffff",
              boxShadow:
                "0 4px 16px rgba(15, 23, 42, 0.05)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
                gap: 16,
                flexWrap: "wrap",
              }}
            >

              <div>

                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.04em",
                    marginBottom: 5,
                  }}
                >
                  Reporting period
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                  }}
                >
                  {formatMonth(
                    period.period_year,
                    period.period_month
                  )}
                </h2>

              </div>

              <span
                style={{
                  ...getStatusStyle(
                    period.status
                  ),
                  padding: "6px 11px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform:
                    "uppercase",
                  letterSpacing:
                    "0.03em",
                }}
              >
                {formatStatus(
                  period.status
                )}
              </span>

            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
                marginTop: 16,
                paddingTop: 14,
                borderTop:
                  "1px solid #e5e7eb",
              }}
            >

              <InfoItem
                label="Collection opens"
                value={formatDateTime(
                  period.collection_opens_at
                )}
              />

              <InfoItem
                label="Collection closes"
                value={formatDateTime(
                  period.collection_closes_at
                )}
              />

            </div>

          </section>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >

            <ReportCard
              title="Apartments"
              value={
                summary.apartments_total
              }
            />

            <ReportCard
              title="Submitted"
              value={
                summary.apartments_submitted
              }
            />

            <ReportCard
              title="Missing"
              value={
                summary.apartments_missing
              }
              warning={
                summary.apartments_missing >
                0
              }
            />

            <ReportCard
              title="Meters"
              value={
                summary.meters_total
              }
            />

            <ReportCard
              title="Meters submitted"
              value={
                summary.meters_submitted
              }
            />

            <ReportCard
              title="Meters missing"
              value={
                summary.meters_missing
              }
              warning={
                summary.meters_missing >
                0
              }
            />

            <ReportCard
              title="Cold Water"
              value={
                formatConsumption(
                  summary.cold_consumption
                )
              }
            />

            <ReportCard
              title="Hot Water"
              value={
                formatConsumption(
                  summary.hot_consumption
                )
              }
            />

          </div>

          <section
            style={{
              padding: 18,
              border:
                "1px solid #e5e7eb",
              borderRadius: 16,
              background: "#ffffff",
              boxShadow:
                "0 4px 16px rgba(15, 23, 42, 0.05)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
                paddingBottom: 12,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >

              <div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                  }}
                >
                  Apartments requiring
                  attention
                </h2>

                <p
                  style={{
                    marginTop: 5,
                    marginBottom: 0,
                    color: "#6b7280",
                    fontSize: 13,
                    lineHeight: 1.4,
                  }}
                >
                  Apartments with one or
                  more missing meter
                  readings.
                </p>

              </div>

              <span
                style={{
                  minWidth: 32,
                  padding: "5px 9px",
                  borderRadius: 999,
                  background:
                    missingApartments
                      .length > 0
                      ? "#ffedd5"
                      : "#dcfce7",
                  color:
                    missingApartments
                      .length > 0
                      ? "#9a3412"
                      : "#166534",
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {
                  missingApartments.length
                }
              </span>

            </div>

            {missingApartments.length ===
            0 ? (

              <div
                style={{
                  padding: "14px 0",
                  color: "#166534",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                All apartments have
                submitted readings for
                every active meter.
              </div>

            ) : (

              <div
                style={{
                  display: "grid",
                  gap: 8,
                }}
              >

                {missingApartments.map(
                  (apartment) => (

                    <div
                      key={
                        apartment
                          .apartment_id
                      }
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: 12,
                        padding:
                          "10px 12px",
                        border:
                          "1px solid #fed7aa",
                        borderRadius: 10,
                        background:
                          "#fff7ed",
                      }}
                    >

                      <div>

                        <div
                          style={{
                            color:
                              "#111827",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          Apartment #
                          {
                            apartment
                              .apartment_number
                          }
                        </div>

                        <div
                          style={{
                            marginTop: 2,
                            color:
                              "#9a3412",
                            fontSize: 12,
                          }}
                        >
                          Missing readings
                        </div>

                      </div>

                      <span
                        style={{
                          padding:
                            "5px 9px",
                          borderRadius:
                            999,
                          background:
                            "#ffffff",
                          border:
                            "1px solid #fed7aa",
                          color:
                            "#9a3412",
                          fontSize: 12,
                          fontWeight: 700,
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {
                          apartment
                            .missing_meter_count
                        }
                        {" "}
                        {
                          apartment
                            .missing_meter_count ===
                          1
                            ? "meter"
                            : "meters"
                        }
                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </>

      )}

    </div>
  );
}

function InfoItem({
  label,
  value,
}) {

  return (
    <div>

      <div
        style={{
          marginBottom: 4,
          color: "#6b7280",
          fontSize: 12,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#111827",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {value}
      </div>

    </div>
  );
}

function ReportCard({
  title,
  value,
  warning = false,
}) {

  return (
    <div
      style={{
        padding: 16,
        border:
          warning
            ? "1px solid #fed7aa"
            : "1px solid #e5e7eb",
        borderRadius: 14,
        background:
          warning
            ? "#fff7ed"
            : "#ffffff",
        boxShadow:
          "0 3px 12px rgba(15, 23, 42, 0.04)",
      }}
    >

      <div
        style={{
          marginBottom: 7,
          color:
            warning
              ? "#9a3412"
              : "#6b7280",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color:
            warning
              ? "#9a3412"
              : "#111827",
          fontSize: 25,
          fontWeight: 700,
          fontVariantNumeric:
            "tabular-nums",
        }}
      >
        {value}
      </div>

    </div>
  );
}
