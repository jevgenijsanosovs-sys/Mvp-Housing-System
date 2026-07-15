import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Modal
  from "../components/Modal";

import { api }
  from "../services/api";

import useWater
  from "../hooks/useWater";

export default function WaterMetersPage() {

  const {
    adminWaterMeters,
    loadAdminWaterMeters,
    addWaterMeter,
    deactivateMeter,
  } = useWater();

  const [
    isMobile,
    setIsMobile
  ] = useState(
    window.innerWidth < 768
  );

  const [
    apartments,
    setApartments
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    filter,
    setFilter
  ] = useState({
    search: "",
    type: "all",
    status: "active",
  });

  const [
    addOpen,
    setAddOpen
  ] = useState(false);

  const [
    addSubmitting,
    setAddSubmitting
  ] = useState(false);

  const [
    addForm,
    setAddForm
  ] = useState({
    apartmentId: "",
    type: "cold",
    serialNumber: "",
    installedAt: "",
  });

  const [
    deactivateOpen,
    setDeactivateOpen
  ] = useState(false);

  const [
    selectedMeterIds,
    setSelectedMeterIds
  ] = useState([]);

  const [
    deactivateReason,
    setDeactivateReason
  ] = useState("replacement");

  const [
    deactivateSubmitting,
    setDeactivateSubmitting
  ] = useState(false);

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

  const loadPageData =
    async () => {

      setLoading(true);

      try {

        const [
          apartmentData,
        ] = await Promise.all([
          api(
            "/api/admin/apartments"
          ),

          loadAdminWaterMeters(),
        ]);

        setApartments(
          Array.isArray(
            apartmentData
          )
            ? apartmentData
            : []
        );

      } catch (error) {

        console.error(
          "Load water meter management failed:",
          error
        );

        alert(
          "Water meter data load failed"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    loadPageData();

  }, []);

  const normalizedMeters =
    useMemo(
      () =>
        adminWaterMeters.map(
          (meter) => ({

            ...meter,

            status:
              Number(
                meter.active
              ) === 1
                ? "active"
                : "inactive",

            riser:
              meter.riser_code ||
              "Not assigned",

            location:
              meter.local_label ||
              "Not assigned",
          })
        ),
      [adminWaterMeters]
    );

  const filteredMeters =
    useMemo(
      () =>
        normalizedMeters.filter(
          (meter) => {

            const search =
              filter.search
                .trim()
                .toLowerCase();

            if (search) {

              const searchable =
                [
                  meter.apartment_number,
                  meter.type,
                  meter.serial_number,
                  meter.riser,
                  meter.location,
                ]
                  .map(
                    (value) =>
                      String(
                        value ?? ""
                      ).toLowerCase()
                  )
                  .join(" ");

              if (
                !searchable.includes(
                  search
                )
              ) {
                return false;
              }
            }

            if (
              filter.type !== "all" &&
              meter.type !==
                filter.type
            ) {
              return false;
            }

            if (
              filter.status !== "all" &&
              meter.status !==
                filter.status
            ) {
              return false;
            }

            return true;
          }
        ),
      [
        normalizedMeters,
        filter,
      ]
    );

  const groupedMeters =
    useMemo(
      () =>
        Object.values(
          filteredMeters.reduce(
            (
              groups,
              meter
            ) => {

              const key =
                String(
                  meter.apartment_id
                );

              if (!groups[key]) {

                groups[key] = {
                  apartment_id:
                    meter.apartment_id,

                  apartment_number:
                    meter.apartment_number,

                  meters: [],
                };
              }

              groups[key]
                .meters.push(
                  meter
                );

              return groups;
            },
            {}
          )
        ).sort(
          (a, b) =>
            Number(
              a.apartment_number
            ) -
            Number(
              b.apartment_number
            )
        ),
      [filteredMeters]
    );

  const activeMeters =
    normalizedMeters.filter(
      (meter) =>
        meter.status ===
        "active"
    );

  const resetAddForm = () => {

    setAddForm({
      apartmentId: "",
      type: "cold",
      serialNumber: "",
      installedAt: "",
    });
  };

  const handleAddMeter =
    async () => {

      if (addSubmitting) {
        return;
      }

      setAddSubmitting(true);

      try {

        const success =
          await addWaterMeter({
            apartmentId:
              addForm.apartmentId,

            type:
              addForm.type,

            serialNumber:
              addForm.serialNumber,

            installedAt:
              addForm.installedAt,
          });

        if (success) {

          setAddOpen(false);
          resetAddForm();
        }

      } finally {

        setAddSubmitting(false);
      }
    };

  const toggleSelectedMeter =
    (meterId) => {

      setSelectedMeterIds(
        (current) =>
          current.includes(
            meterId
          )
            ? current.filter(
                (id) =>
                  id !== meterId
              )
            : [
                ...current,
                meterId,
              ]
      );
    };

  const openDeactivate = () => {

    setSelectedMeterIds([]);
    setDeactivateReason(
      "replacement"
    );
    setDeactivateOpen(true);
  };

  const handleDeactivate =
    async () => {

      if (
        deactivateSubmitting
      ) {
        return;
      }

      if (
        selectedMeterIds.length ===
        0
      ) {

        alert(
          "Select at least one active water meter"
        );

        return;
      }

      setDeactivateSubmitting(
        true
      );

      let successCount = 0;

      try {

        for (
          const meterId of
          selectedMeterIds
        ) {

          const success =
            await deactivateMeter(
              meterId,
              deactivateReason,
              {
                suppressSuccessAlert:
                  true,

                suppressReload:
                  true,
              }
            );

          if (!success) {
            break;
          }

          successCount += 1;
        }

        if (
          successCount > 0
        ) {

          await loadAdminWaterMeters();
        }

        if (
          successCount ===
          selectedMeterIds.length
        ) {

          setDeactivateOpen(false);
          setSelectedMeterIds([]);

          alert(
            successCount === 1
              ? "Water meter deactivated"
              : `${successCount} water meters deactivated`
          );
        }

      } finally {

        setDeactivateSubmitting(
          false
        );
      }
    };

  const formatType = (
    type
  ) =>
    type === "hot"
      ? "Hot Water"
      : "Cold Water";

  const formatDate = (
    value
  ) => {

    if (!value) {
      return "—";
    }

    return String(value)
      .slice(0, 10);
  };

  const formatReading = (
    value
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const storedValue =
      Number(value);

    if (
      !Number.isFinite(
        storedValue
      )
    ) {
      return String(value);
    }

    return (
      (storedValue / 1000)
        .toFixed(3)
        .replace(".", ",") +
      " m³"
    );
  };

  return (
    <div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 22,
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,
            }}
          >
            Water Meter Management
          </h1>

          <p
            style={{
              marginTop: 8,
              color:
                "var(--text)",
              lineHeight: 1.5,
            }}
          >
            Manage active and inactive
            apartment water meters.
          </p>

        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >

          <button
            type="button"
            onClick={
              loadPageData
            }
            style={secondaryButton}
          >
            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              setAddOpen(true)
            }
            style={primaryButton}
          >
            Add Meter
          </button>

          <button
            type="button"
            onClick={
              openDeactivate
            }
            disabled={
              activeMeters.length ===
              0
            }
            style={{
              ...dangerButton,

              opacity:
                activeMeters.length ===
                0
                  ? 0.55
                  : 1,

              cursor:
                activeMeters.length ===
                0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Deactivate
          </button>

        </div>

      </div>

      <section
        style={{
          marginBottom: 18,
          padding: 14,
          border:
            "1px solid var(--border)",
          borderRadius: 14,
          background:
            "var(--surface)",
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 10,
          }}
        >

          <input
            type="search"
            value={
              filter.search
            }
            onChange={(event) =>
              setFilter(
                (current) => ({
                  ...current,

                  search:
                    event.target.value,
                })
              )
            }
            placeholder="Search apartment, serial, riser..."
            style={fieldStyle}
          />

          <select
            value={filter.type}
            onChange={(event) =>
              setFilter(
                (current) => ({
                  ...current,

                  type:
                    event.target.value,
                })
              )
            }
            style={fieldStyle}
          >
            <option value="all">
              All types
            </option>
            <option value="cold">
              Cold Water
            </option>
            <option value="hot">
              Hot Water
            </option>
          </select>

          <select
            value={
              filter.status
            }
            onChange={(event) =>
              setFilter(
                (current) => ({
                  ...current,

                  status:
                    event.target.value,
                })
              )
            }
            style={fieldStyle}
          >
            <option value="all">
              All statuses
            </option>
            <option value="active">
              Active
            </option>
            <option value="inactive">
              Inactive
            </option>
          </select>

        </div>

      </section>

      {loading ? (

        <div
          style={emptyState}
        >
          Loading water meters...
        </div>

      ) : filteredMeters.length ===
        0 ? (

        <div
          style={emptyState}
        >
          No water meters match the
          selected filters.
        </div>

      ) : isMobile ? (

        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >

          {groupedMeters.map(
            (apartment) => (

              <section
                key={
                  apartment
                    .apartment_id
                }
                style={apartmentCard}
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
                    paddingBottom: 10,
                    borderBottom:
                      "1px solid var(--border)",
                  }}
                >

                  <strong
                    style={{
                      color:
                        "var(--text-h)",
                      fontSize: 16,
                    }}
                  >
                    Apartment #
                    {
                      apartment
                        .apartment_number
                    }
                  </strong>

                  <span
                    style={countBadge}
                  >
                    {
                      apartment
                        .meters.length
                    }
                  </span>

                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                  }}
                >

                  {apartment
                    .meters.map(
                      (meter) => (

                        <MeterCard
                          key={
                            meter.id
                          }
                          meter={meter}
                          formatType={
                            formatType
                          }
                          formatDate={
                            formatDate
                          }
                          formatReading={
                            formatReading
                          }
                        />

                      )
                    )}

                </div>

              </section>

            )
          )}

        </div>

      ) : (

        <div
          style={{
            overflowX: "auto",
            border:
              "1px solid var(--border)",
            borderRadius: 14,
            background:
              "var(--surface)",
          }}
        >

          <table
            style={{
              width: "100%",
              minWidth: 1050,
              borderCollapse:
                "collapse",
              fontSize: 13,
            }}
          >

            <thead>

              <tr
                style={{
                  background:
                    "var(--surface-soft)",
                }}
              >

                {[
                  "Apartment",
                  "Type / Location",
                  "Serial Number",
                  "Riser",
                  "Installed",
                  "Last Reading",
                  "Last Date",
                  "Status",
                ].map(
                  (heading) => (

                    <th
                      key={heading}
                      style={tableHeader}
                    >
                      {heading}
                    </th>

                  )
                )}

              </tr>

            </thead>

            <tbody>

              {filteredMeters.map(
                (
                  meter,
                  index
                ) => (

                  <tr
                    key={meter.id}
                    style={{
                      background:
                        index % 2 === 0
                          ? "var(--surface)"
                          : "var(--surface-soft)",
                    }}
                  >

                    <td style={tableCellStrong}>
                      #
                      {
                        meter.apartment_number
                      }
                    </td>

                    <td style={tableCell}>
                      <div
                        style={{
                          fontWeight: 700,
                          color:
                            "var(--text-h)",
                        }}
                      >
                        {formatType(
                          meter.type
                        )}
                      </div>

                      <div
                        style={{
                          marginTop: 2,
                          color:
                            "var(--text)",
                          fontSize: 11,
                        }}
                      >
                        {meter.location}
                      </div>
                    </td>

                    <td style={tableCellStrong}>
                      {meter.serial_number ||
                        "—"}
                    </td>

                    <td
                      style={{
                        ...tableCell,
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        fontSize: 11,
                      }}
                    >
                      {meter.riser}
                    </td>

                    <td style={tableCell}>
                      {formatDate(
                        meter.installed_at
                      )}
                    </td>

                    <td
                      style={{
                        ...tableCellStrong,
                        textAlign: "right",
                        fontVariantNumeric:
                          "tabular-nums",
                      }}
                    >
                      {formatReading(
                        meter.last_reading
                      )}
                    </td>

                    <td style={tableCell}>
                      {formatDate(
                        meter.last_reading_date
                      )}
                    </td>

                    <td style={tableCell}>
                      <StatusBadge
                        active={
                          meter.status ===
                          "active"
                        }
                      />
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

      <Modal
        open={addOpen}
        title="Add Water Meter"
        onClose={() => {

          if (!addSubmitting) {
            setAddOpen(false);
          }
        }}
      >

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >

          <FormField
            label="Apartment"
          >
            <select
              value={
                addForm.apartmentId
              }
              disabled={
                addSubmitting
              }
              onChange={(event) =>
                setAddForm(
                  (current) => ({
                    ...current,

                    apartmentId:
                      event.target.value,
                  })
                )
              }
              style={fieldStyle}
            >
              <option value="">
                Select apartment
              </option>

              {apartments.map(
                (apartment) => (

                  <option
                    key={
                      apartment.id
                    }
                    value={
                      apartment.id
                    }
                  >
                    Apartment #
                    {apartment.number}
                  </option>

                )
              )}
            </select>
          </FormField>

          <FormField
            label="Type"
          >
            <select
              value={
                addForm.type
              }
              disabled={
                addSubmitting
              }
              onChange={(event) =>
                setAddForm(
                  (current) => ({
                    ...current,

                    type:
                      event.target.value,
                  })
                )
              }
              style={fieldStyle}
            >
              <option value="cold">
                Cold Water
              </option>
              <option value="hot">
                Hot Water
              </option>
            </select>
          </FormField>

          <FormField
            label="Serial Number"
          >
            <input
              type="text"
              value={
                addForm.serialNumber
              }
              disabled={
                addSubmitting
              }
              onChange={(event) =>
                setAddForm(
                  (current) => ({
                    ...current,

                    serialNumber:
                      event.target.value,
                  })
                )
              }
              style={fieldStyle}
            />
          </FormField>

          <FormField
            label="Installed Date"
          >
            <input
              type="date"
              value={
                addForm.installedAt
              }
              disabled={
                addSubmitting
              }
              onChange={(event) =>
                setAddForm(
                  (current) => ({
                    ...current,

                    installedAt:
                      event.target.value,
                  })
                )
              }
              style={fieldStyle}
            />
          </FormField>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 8,
              marginTop: 4,
            }}
          >

            <button
              type="button"
              onClick={() =>
                setAddOpen(false)
              }
              disabled={
                addSubmitting
              }
              style={secondaryButton}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                handleAddMeter
              }
              disabled={
                addSubmitting
              }
              style={{
                ...primaryButton,

                opacity:
                  addSubmitting
                    ? 0.65
                    : 1,
              }}
            >
              {addSubmitting
                ? "Adding..."
                : "Add Meter"}
            </button>

          </div>

        </div>

      </Modal>

      <Modal
        open={deactivateOpen}
        title="Deactivate Water Meters"
        onClose={() => {

          if (
            !deactivateSubmitting
          ) {
            setDeactivateOpen(false);
          }
        }}
      >

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >

          <p
            style={{
              color:
                "var(--text)",
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            Select one or more active
            water meters. Historical
            readings will be preserved.
          </p>

          <div
            style={{
              maxHeight: 320,
              overflowY: "auto",
              display: "grid",
              gap: 8,
              paddingRight: 4,
            }}
          >

            {activeMeters.map(
              (meter) => (

                <label
                  key={meter.id}
                  style={{
                    display: "flex",
                    alignItems:
                      "flex-start",
                    gap: 10,
                    padding: 10,
                    border:
                      "1px solid var(--border)",
                    borderRadius: 9,
                    background:
                      selectedMeterIds
                        .includes(
                          meter.id
                        )
                        ? "var(--surface-muted)"
                        : "var(--surface)",
                    cursor: "pointer",
                  }}
                >

                  <input
                    type="checkbox"
                    checked={
                      selectedMeterIds
                        .includes(
                          meter.id
                        )
                    }
                    disabled={
                      deactivateSubmitting
                    }
                    onChange={() =>
                      toggleSelectedMeter(
                        meter.id
                      )
                    }
                  />

                  <span
                    style={{
                      minWidth: 0,
                    }}
                  >

                    <strong
                      style={{
                        color:
                          "var(--text-h)",
                        fontSize: 13,
                      }}
                    >
                      Apartment #
                      {
                        meter.apartment_number
                      }
                      {" · "}
                      {formatType(
                        meter.type
                      )}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        marginTop: 2,
                        color:
                          "var(--text)",
                        fontSize: 11,
                      }}
                    >
                      Serial{" "}
                      {
                        meter.serial_number ||
                        "—"
                      }
                      {" · "}
                      {meter.riser}
                    </span>

                  </span>

                </label>

              )
            )}

          </div>

          <FormField
            label="Reason"
          >
            <select
              value={
                deactivateReason
              }
              disabled={
                deactivateSubmitting
              }
              onChange={(event) =>
                setDeactivateReason(
                  event.target.value
                )
              }
              style={fieldStyle}
            >
              <option value="replacement">
                Replacement
              </option>
              <option value="fault">
                Fault
              </option>
              <option value="removed">
                Removed
              </option>
              <option value="other">
                Other
              </option>
            </select>
          </FormField>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 8,
            }}
          >

            <button
              type="button"
              onClick={() =>
                setDeactivateOpen(false)
              }
              disabled={
                deactivateSubmitting
              }
              style={secondaryButton}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                handleDeactivate
              }
              disabled={
                deactivateSubmitting
              }
              style={{
                ...dangerButton,

                opacity:
                  deactivateSubmitting
                    ? 0.65
                    : 1,
              }}
            >
              {deactivateSubmitting
                ? "Deactivating..."
                : "Deactivate"}
            </button>

          </div>

        </div>

      </Modal>

    </div>
  );
}

function FormField({
  label,
  children,
}) {

  return (
    <label
      style={{
        display: "grid",
        gap: 5,
      }}
    >

      <span
        style={{
          color:
            "var(--text-h)",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      {children}

    </label>
  );
}

function StatusBadge({
  active,
}) {

  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 9px",
        borderRadius: 999,
        background:
          active
            ? "#dcfce7"
            : "var(--surface-muted)",
        color:
          active
            ? "#166534"
            : "var(--text)",
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {active
        ? "Active"
        : "Inactive"}
    </span>
  );
}

function MeterCard({
  meter,
  formatType,
  formatDate,
  formatReading,
}) {

  return (
    <div
      style={{
        padding: 12,
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
            "flex-start",
          gap: 10,
          marginBottom: 10,
        }}
      >

        <div>

          <div
            style={{
              color:
                "var(--text-h)",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {formatType(
              meter.type
            )}
          </div>

          <div
            style={{
              marginTop: 2,
              color:
                "var(--text)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {meter.location}
          </div>

        </div>

        <StatusBadge
          active={
            meter.status ===
            "active"
          }
        />

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

        {[
          [
            "Serial Number",
            meter.serial_number ||
              "—",
          ],
          [
            "Riser",
            meter.riser,
          ],
          [
            "Installed",
            formatDate(
              meter.installed_at
            ),
          ],
          [
            "Last Reading",
            formatReading(
              meter.last_reading
            ),
          ],
          [
            "Last Date",
            formatDate(
              meter.last_reading_date
            ),
          ],
        ].map(
          ([
            label,
            value,
          ]) => (

            <>
              <span
                key={
                  `${label}-label`
                }
                style={{
                  color:
                    "var(--text)",
                }}
              >
                {label}
              </span>

              <span
                key={
                  `${label}-value`
                }
                style={{
                  color:
                    "var(--text-h)",
                  textAlign: "right",
                  fontWeight: 600,
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

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 10px",
  border:
    "1px solid var(--input-border)",
  borderRadius: 9,
  background:
    "var(--input-bg)",
  color:
    "var(--input-text)",
  fontSize: 13,
};

const primaryButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 9,
  background: "#2563eb",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton = {
  padding: "10px 14px",
  border:
    "1px solid var(--border)",
  borderRadius: 9,
  background:
    "var(--surface)",
  color:
    "var(--text-h)",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const dangerButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 9,
  background: "#dc2626",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const emptyState = {
  padding: 24,
  border:
    "1px solid var(--border)",
  borderRadius: 14,
  background:
    "var(--surface)",
  color:
    "var(--text)",
};

const apartmentCard = {
  padding: 14,
  border:
    "1px solid var(--border)",
  borderRadius: 16,
  background:
    "var(--surface)",
  boxShadow:
    "var(--shadow)",
};

const countBadge = {
  minWidth: 28,
  padding: "4px 8px",
  borderRadius: 999,
  background:
    "var(--surface-muted)",
  color:
    "var(--text)",
  textAlign: "center",
  fontSize: 11,
  fontWeight: 700,
};

const tableHeader = {
  padding: "10px 12px",
  borderBottom:
    "1px solid var(--border)",
  color:
    "var(--text-h)",
  fontWeight: 700,
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tableCell = {
  padding: "10px 12px",
  borderBottom:
    "1px solid var(--border-soft)",
  color:
    "var(--text)",
  verticalAlign: "middle",
};

const tableCellStrong = {
  ...tableCell,
  color:
    "var(--text-h)",
  fontWeight: 600,
};
