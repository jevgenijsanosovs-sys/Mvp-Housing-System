import { useEffect } from "react";

import useWater from "../hooks/useWater";

export default function AdminMonthlyReportPage() {

  const {

    adminMonthlyReport,

    adminMonthlyReportLoading,

    adminMonthlyReportError,

    loadAdminMonthlyReport,

  } = useWater();

  useEffect(() => {

    loadAdminMonthlyReport(
      2026,
      7
    );

  }, []);

  const summary =
    adminMonthlyReport?.summary;

  const period =
    adminMonthlyReport?.period;

  return (

    <div>

      <h1>
        Water Monthly Report
      </h1>

      {adminMonthlyReportLoading && (

        <p>
          Loading...
        </p>

      )}

      {adminMonthlyReportError && (

        <p
          style={{
            color: "red",
          }}
        >
          {adminMonthlyReportError}
        </p>

      )}

      {!adminMonthlyReportLoading &&
       adminMonthlyReport &&
       (

        <>

          <div
            style={{
              border:
                "1px solid #ddd",

              borderRadius: 12,

              padding: 20,

              marginBottom: 20,
            }}
          >

            <h2
              style={{
                marginTop: 0,
              }}
            >
              Period
            </h2>

            <p>

              {period.period_month}/
              {period.period_year}

            </p>

            <p>

              Status:

              {" "}

              <b>

                {period.status}

              </b>

            </p>

          </div>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",

              gap: 16,
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
            />

            <ReportCard
              title="Cold Water"

              value={
                (
                  summary.cold_consumption /
                  1000
                ).toFixed(3)
                + " m³"
              }
            />

            <ReportCard
              title="Hot Water"

              value={
                (
                  summary.hot_consumption /
                  1000
                ).toFixed(3)
                + " m³"
              }
            />

          </div>

        </>

      )}

    </div>

  );

}

function ReportCard({

  title,

  value,

}) {

  return (

    <div
      style={{
        border:
          "1px solid #ddd",

        borderRadius: 12,

        padding: 18,

        background:
          "#fff",
      }}
    >

      <div
        style={{
          color: "#666",

          marginBottom: 8,
        }}
      >

        {title}

      </div>

      <div
        style={{
          fontSize: 28,

          fontWeight: 700,
        }}
      >

        {value}

      </div>

    </div>

  );

}
