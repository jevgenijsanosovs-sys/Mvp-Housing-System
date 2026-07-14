import {
  useEffect,
  useState,
} from "react";

import useWater from "../hooks/useWater";

export default function AdminMonthlyReportPage() {

  const [
    isMobile,
    setIsMobile
  ] = useState(
    window.innerWidth < 768
  );

  const [
    expandedAttentionApartments,
    setExpandedAttentionApartments
  ] = useState({});

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

    const handleResize = () => {

      setIsMobile(
        window.innerWidth < 768
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

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

  const reportRows =
    Array.isArray(
      adminMonthlyReport?.rows
    )
      ? adminMonthlyReport.rows
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

  const formatMeterType = (
    value
  ) => {

    const normalizedValue =
      String(value || "")
        .trim()
        .toLowerCase();

    if (normalizedValue === "cold") {
      return "Cold Water";
    }

    if (normalizedValue === "hot") {
      return "Hot Water";
    }

    return value || "Water";
  };

  const formatRowStatus = (
    value
  ) => {

    const labels = {
      complete: "Complete",
      missing_current:
        "Missing current",
      missing_previous:
        "Missing previous",
      negative_consumption:
        "Negative consumption",
    };

    return (
      labels[value] ||
      formatStatus(value)
    );
  };

  const getRowStatusStyle = (
    value
  ) => {

    if (value === "complete") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (
      value ===
      "negative_consumption"
    ) {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    return {
      background: "#ffedd5",
      color: "#9a3412",
    };
  };

  const toggleAttentionApartment =
    (apartmentId) => {

      setExpandedAttentionApartments(
        (current) => ({
          ...current,

          [apartmentId]:
            !current[apartmentId],
        })
      );
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
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >

            <SummaryGroupCard
              title="Apartments"
              primaryValue={
                summary.apartments_total
              }
              items={[
                {
                  label: "Submitted",
                  value:
                    summary.apartments_submitted,
                },
                {
                  label: "Missing",
                  value:
                    summary.apartments_missing,
                  warning:
                    summary.apartments_missing >
                    0,
                },
              ]}
            />

            <SummaryGroupCard
              title="Meters"
              primaryValue={
                summary.meters_total
              }
              items={[
                {
                  label: "Submitted",
                  value:
                    summary.meters_submitted,
                },
                {
                  label: "Missing",
                  value:
                    summary.meters_missing,
                  warning:
                    summary.meters_missing >
                    0,
                },
              ]}
            />

            <SummaryGroupCard
              title="Water consumption"
              primaryLabel="Total"
              primaryValue={
                formatConsumption(
                  Number(
                    summary.cold_consumption ||
                    0
                  ) +
                  Number(
                    summary.hot_consumption ||
                    0
                  )
                )
              }
              items={[
                {
                  label: "Cold Water",
                  value:
                    formatConsumption(
                      summary.cold_consumption
                    ),
                },
                {
                  label: "Hot Water",
                  value:
                    formatConsumption(
                      summary.hot_consumption
                    ),
                },
              ]}
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
                  (apartment) => {

                    const apartmentId =
                      apartment
                        .apartment_id;

                    const isExpanded =
                      Boolean(
                        expandedAttentionApartments[
                          apartmentId
                        ]
                      );

                    const apartmentRows =
                      reportRows.filter(
                        (row) =>
                          row.apartment_id ===
                            apartmentId &&
                          row.status !==
                            "complete"
                      );

                    return (

                      <div
                        key={apartmentId}
                        style={{
                          border:
                            "1px solid #fed7aa",
                          borderRadius: 10,
                          background:
                            "#fff7ed",
                          overflow: "hidden",
                        }}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            toggleAttentionApartment(
                              apartmentId
                            )
                          }
                          aria-expanded={
                            isExpanded
                          }
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            gap: 12,
                            padding:
                              "10px 12px",
                            border: "none",
                            background:
                              "transparent",
                            color:
                              "#111827",
                            textAlign:
                              "left",
                            cursor:
                              "pointer",
                          }}
                        >

                          <div
                            style={{
                              display: "flex",
                              alignItems:
                                "center",
                              gap: 9,
                              minWidth: 0,
                            }}
                          >

                            <span
                              aria-hidden="true"
                              style={{
                                color:
                                  "#9a3412",
                                fontSize: 13,
                                fontWeight: 700,
                                transform:
                                  isExpanded
                                    ? "rotate(90deg)"
                                    : "rotate(0deg)",
                                transition:
                                  "transform 0.18s ease",
                              }}
                            >
                              ▶
                            </span>

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

                        </button>

                        {isExpanded && (

                          <div
                            style={{
                              display: "grid",
                              gap: 8,
                              padding:
                                "0 12px 12px",
                              borderTop:
                                "1px solid #fed7aa",
                            }}
                          >

                            {apartmentRows.length ===
                            0 ? (

                              <div
                                style={{
                                  paddingTop: 10,
                                  color:
                                    "#9a3412",
                                  fontSize: 12,
                                }}
                              >
                                No detailed meter
                                data available.
                              </div>

                            ) : (

                              apartmentRows.map(
                                (row) => (

                                  <div
                                    key={
                                      row.meter_id
                                    }
                                    style={{
                                      marginTop: 8,
                                      padding:
                                        "9px 10px",
                                      border:
                                        "1px solid #fed7aa",
                                      borderRadius: 8,
                                      background:
                                        "#ffffff",
                                    }}
                                  >

                                    <div
                                      style={{
                                        display:
                                          "flex",
                                        justifyContent:
                                          "space-between",
                                        alignItems:
                                          "flex-start",
                                        gap: 10,
                                        marginBottom: 7,
                                      }}
                                    >

                                      <div>

                                        <div
                                          style={{
                                            color:
                                              "#111827",
                                            fontSize: 13,
                                            fontWeight: 700,
                                          }}
                                        >
                                          {formatMeterType(
                                            row.type
                                          )}
                                        </div>

                                        <div
                                          style={{
                                            marginTop: 2,
                                            color:
                                              "#6b7280",
                                            fontSize: 11,
                                          }}
                                        >
                                          {row.local_label ||
                                            "Location not assigned"}
                                        </div>

                                      </div>

                                      <span
                                        style={{
                                          ...getRowStatusStyle(
                                            row.status
                                          ),
                                          padding:
                                            "4px 8px",
                                          borderRadius:
                                            999,
                                          fontSize: 10,
                                          fontWeight: 700,
                                          whiteSpace:
                                            "nowrap",
                                        }}
                                      >
                                        {formatRowStatus(
                                          row.status
                                        )}
                                      </span>

                                    </div>

                                    <div
                                      style={{
                                        display:
                                          "grid",
                                        gridTemplateColumns:
                                          "auto minmax(0, 1fr)",
                                        columnGap: 10,
                                        rowGap: 4,
                                        fontSize: 11,
                                        lineHeight: 1.35,
                                      }}
                                    >

                                      <span
                                        style={{
                                          color:
                                            "#6b7280",
                                        }}
                                      >
                                        Serial number
                                      </span>

                                      <span
                                        style={{
                                          textAlign:
                                            "right",
                                          color:
                                            "#111827",
                                          fontWeight: 600,
                                          overflowWrap:
                                            "anywhere",
                                        }}
                                      >
                                        {row.serial_number ||
                                          "—"}
                                      </span>

                                      <span
                                        style={{
                                          color:
                                            "#6b7280",
                                        }}
                                      >
                                        Riser
                                      </span>

                                      <span
                                        style={{
                                          textAlign:
                                            "right",
                                          color:
                                            "#111827",
                                          fontWeight: 600,
                                          fontFamily:
                                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                          overflowWrap:
                                            "anywhere",
                                        }}
                                      >
                                        {row.riser_code ||
                                          "—"}
                                      </span>

                                    </div>

                                  </div>

                                )
                              )

                            )}

                          </div>

                        )}

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </section>

          <section
            style={{
              marginTop: 20,
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
                  Meter details
                </h2>

                <p
                  style={{
                    marginTop: 5,
                    marginBottom: 0,
                    color: "#6b7280",
                    fontSize: 13,
                  }}
                >
                  Previous and current
                  readings for every
                  active water meter.
                </p>
              </div>

              <span
                style={{
                  padding: "5px 9px",
                  borderRadius: 999,
                  background: "#f3f4f6",
                  color: "#4b5563",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {reportRows.length}
              </span>
            </div>

            {reportRows.length === 0 ? (
              <div
                style={{
                  padding: "14px 0",
                  color: "#6b7280",
                  fontSize: 14,
                }}
              >
                No active water meters
                found for this report.
              </div>
            ) : isMobile ? (
              <div
                style={{
                  display: "grid",
                  gap: 10,
                }}
              >
                {reportRows.map(
                  (row) => (
                    <MeterDetailCard
                      key={row.meter_id}
                      row={row}
                      formatMeterType={
                        formatMeterType
                      }
                      formatConsumption={
                        formatConsumption
                      }
                      formatRowStatus={
                        formatRowStatus
                      }
                      getRowStatusStyle={
                        getRowStatusStyle
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <MeterDetailsTable
                rows={reportRows}
                formatMeterType={
                  formatMeterType
                }
                formatConsumption={
                  formatConsumption
                }
                formatRowStatus={
                  formatRowStatus
                }
                getRowStatusStyle={
                  getRowStatusStyle
                }
              />
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

function SummaryGroupCard({
  title,
  primaryLabel = "Total",
  primaryValue,
  items = [],
}) {

  return (
    <section
      style={{
        padding: 16,
        border:
          "1px solid #e5e7eb",
        borderRadius: 14,
        background: "#ffffff",
        boxShadow:
          "0 3px 12px rgba(15, 23, 42, 0.04)",
      }}
    >

      <div
        style={{
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom:
            "1px solid #e5e7eb",
        }}
      >

        <div
          style={{
            marginBottom: 5,
            color: "#6b7280",
            fontSize: 12,
            fontWeight: 700,
            textTransform:
              "uppercase",
            letterSpacing:
              "0.04em",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "baseline",
            gap: 12,
          }}
        >

          <span
            style={{
              color: "#6b7280",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {primaryLabel}
          </span>

          <span
            style={{
              color: "#111827",
              fontSize: 25,
              fontWeight: 700,
              fontVariantNumeric:
                "tabular-nums",
              textAlign: "right",
            }}
          >
            {primaryValue}
          </span>

        </div>

      </div>

      <div
        style={{
          display: "grid",
          gap: 8,
        }}
      >

        {items.map(
          (item) => (

            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 12,
                padding:
                  item.warning
                    ? "8px 9px"
                    : "3px 0",
                borderRadius:
                  item.warning
                    ? 8
                    : 0,
                background:
                  item.warning
                    ? "#fff7ed"
                    : "transparent",
              }}
            >

              <span
                style={{
                  color:
                    item.warning
                      ? "#9a3412"
                      : "#6b7280",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </span>

              <span
                style={{
                  color:
                    item.warning
                      ? "#9a3412"
                      : "#111827",
                  fontSize: 15,
                  fontWeight: 700,
                  fontVariantNumeric:
                    "tabular-nums",
                  textAlign: "right",
                }}
              >
                {item.value}
              </span>

            </div>

          )
        )}

      </div>

    </section>
  );
}

function MeterDetailsTable({
  rows,
  formatMeterType,
  formatConsumption,
  formatRowStatus,
  getRowStatusStyle,
}) {

  const headings = [
    "Apartment",
    "Type / Location",
    "Serial Number",
    "Riser",
    "Previous",
    "Current",
    "Consumption",
    "Status",
  ];

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        border:
          "1px solid #e5e7eb",
        borderRadius: 10,
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: 1080,
          borderCollapse:
            "collapse",
          fontSize: 12,
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f3f4f6",
            }}
          >
            {headings.map(
              (heading, index) => (
                <th
                  key={heading}
                  style={{
                    padding:
                      "9px 10px",
                    textAlign:
                      index >= 4 &&
                      index <= 6
                        ? "right"
                        : "left",
                    color: "#374151",
                    fontWeight: 700,
                    borderBottom:
                      "1px solid #d1d5db",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {rows.map(
            (row, index) => {

              const isLast =
                index ===
                rows.length - 1;

              const borderBottom =
                isLast
                  ? "none"
                  : "1px solid #e5e7eb";

              return (
                <tr
                  key={row.meter_id}
                  style={{
                    background:
                      index % 2 === 0
                        ? "#ffffff"
                        : "#f9fafb",
                  }}
                >
                  <td
                    style={{
                      padding:
                        "8px 10px",
                      borderBottom,
                      fontWeight: 700,
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    #{row.apartment_number}
                  </td>

                  <td
                    style={{
                      padding:
                        "8px 10px",
                      borderBottom,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {formatMeterType(
                        row.type
                      )}
                    </div>
                    <div
                      style={{
                        marginTop: 2,
                        color: "#6b7280",
                        fontSize: 11,
                      }}
                    >
                      {row.local_label ||
                        "—"}
                    </div>
                  </td>

                  <td
                    style={{
                      padding:
                        "8px 10px",
                      borderBottom,
                      fontWeight: 600,
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {row.serial_number ||
                      "—"}
                  </td>

                  <td
                    style={{
                      padding:
                        "8px 10px",
                      borderBottom,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      fontSize: 11,
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {row.riser_code ||
                      "—"}
                  </td>

                  {[
                    row.previous_reading,
                    row.current_reading,
                    row.consumption,
                  ].map(
                    (
                      value,
                      valueIndex
                    ) => (
                      <td
                        key={
                          valueIndex
                        }
                        style={{
                          padding:
                            "8px 10px",
                          borderBottom,
                          textAlign:
                            "right",
                          fontWeight:
                            valueIndex ===
                            2
                              ? 700
                              : 600,
                          color:
                            valueIndex ===
                              2 &&
                            Number(value) <
                              0
                              ? "#b91c1c"
                              : "#111827",
                          whiteSpace:
                            "nowrap",
                          fontVariantNumeric:
                            "tabular-nums",
                        }}
                      >
                        {value === null ||
                        value ===
                          undefined
                          ? "—"
                          : formatConsumption(
                              value
                            )}
                      </td>
                    )
                  )}

                  <td
                    style={{
                      padding:
                        "8px 10px",
                      borderBottom,
                    }}
                  >
                    <span
                      style={{
                        ...getRowStatusStyle(
                          row.status
                        ),
                        display:
                          "inline-block",
                        padding:
                          "4px 8px",
                        borderRadius:
                          999,
                        fontSize: 10,
                        fontWeight: 700,
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {formatRowStatus(
                        row.status
                      )}
                    </span>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}

function MeterDetailCard({
  row,
  formatMeterType,
  formatConsumption,
  formatRowStatus,
  getRowStatusStyle,
}) {

  const values = [
    [
      "Serial number",
      row.serial_number || "—",
    ],
    [
      "Riser",
      row.riser_code || "—",
    ],
    [
      "Previous",
      row.previous_reading ===
        null ||
      row.previous_reading ===
        undefined
        ? "—"
        : formatConsumption(
            row.previous_reading
          ),
    ],
    [
      "Current",
      row.current_reading ===
        null ||
      row.current_reading ===
        undefined
        ? "—"
        : formatConsumption(
            row.current_reading
          ),
    ],
    [
      "Consumption",
      row.consumption === null ||
      row.consumption ===
        undefined
        ? "—"
        : formatConsumption(
            row.consumption
          ),
    ],
  ];

  return (
    <div
      style={{
        padding: 12,
        border:
          row.status === "complete"
            ? "1px solid #e5e7eb"
            : "1px solid #fed7aa",
        borderRadius: 12,
        background:
          row.status === "complete"
            ? "#f9fafb"
            : "#fff7ed",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Apartment #
            {row.apartment_number}
          </div>

          <div
            style={{
              marginTop: 2,
              color: "#4b5563",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {formatMeterType(
              row.type
            )}
            {row.local_label
              ? ` · ${row.local_label}`
              : ""}
          </div>
        </div>

        <span
          style={{
            ...getRowStatusStyle(
              row.status
            ),
            padding: "4px 8px",
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {formatRowStatus(
            row.status
          )}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "auto minmax(0, 1fr)",
          columnGap: 10,
          rowGap: 5,
          fontSize: 12,
        }}
      >
        {values.map(
          ([label, value]) => (
            <>
              <span
                key={`${label}-label`}
                style={{
                  color: "#6b7280",
                }}
              >
                {label}
              </span>

              <span
                key={`${label}-value`}
                style={{
                  textAlign: "right",
                  fontWeight:
                    label ===
                    "Consumption"
                      ? 700
                      : 600,
                  color:
                    label ===
                      "Consumption" &&
                    Number(
                      row.consumption
                    ) < 0
                      ? "#b91c1c"
                      : "#111827",
                  overflowWrap:
                    "anywhere",
                  fontVariantNumeric:
                    "tabular-nums",
                }}
              >
                {value}
              </span>
            </>
          )
        )}
      </div>
    </div>
  );
}
