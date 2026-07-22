import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import useApartments
  from "../hooks/useApartments";

import Modal
  from "../components/Modal";

import {
  useTranslation,
} from "../i18n";

function compareValues(left, right) {
  return String(left ?? "")
    .localeCompare(
      String(right ?? ""),
      undefined,
      {
        numeric: true,
        sensitivity: "base",
      }
    );
}

function formatArea(value, language) {
  const localeMap = {
    en: "en-GB",
    lv: "lv-LV",
    ru: "ru-RU",
  };

  const number = Number(value || 0);

  return new Intl.NumberFormat(
    localeMap[language] || "en-GB",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  ).format(
    Number.isFinite(number)
      ? number
      : 0
  );
}

function getUniquePeopleCount(apartments) {
  const ids = new Set();

  for (const apartment of apartments) {
    const people = [
      ...(apartment.owners || []),
      ...(apartment.residents || []),
    ];

    for (const person of people) {
      if (
        person?.id !== null &&
        person?.id !== undefined
      ) {
        ids.add(String(person.id));
      }
    }
  }

  return ids.size;
}

function getSummary(apartments) {
  return {
    apartments: apartments.length,
    residents:
      getUniquePeopleCount(
        apartments
      ),
    livingArea:
      apartments.reduce(
        (total, apartment) =>
          total +
          Number(
            apartment.living_area || 0
          ),
        0
      ),
  };
}

function Metric({ label, value }) {
  return (
    <div style={metricStyle}>
      <div style={metricLabelStyle}>
        {label}
      </div>

      <div style={metricValueStyle}>
        {value}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  subtitle,
  summary,
  language,
}) {
  return (
    <section style={summaryCardStyle}>
      <div>
        <div style={summaryTitleStyle}>
          {title}
        </div>

        <div style={summarySubtitleStyle}>
          {subtitle}
        </div>
      </div>

      <div className="apartment-summary-grid">
        <Metric
          label="Apartments"
          value={summary.apartments}
        />

        <Metric
          label="Residents"
          value={summary.residents}
        />

        <Metric
          label="Living area"
          value={`${formatArea(
            summary.livingArea,
            language
          )} m²`}
        />
      </div>
    </section>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={infoItemStyle}>
      <div style={metricLabelStyle}>
        {label}
      </div>

      <div style={infoValueStyle}>
        {value === null ||
        value === undefined ||
        value === ""
          ? "—"
          : String(value)}
      </div>
    </div>
  );
}

function PeopleList({ title, people }) {
  return (
    <section style={subCardStyle}>
      <div style={subCardHeaderStyle}>
        <h3 style={subCardTitleStyle}>
          {title}
        </h3>

        <span style={countBadgeStyle}>
          {people.length}
        </span>
      </div>

      {people.length === 0 ? (
        <div style={emptyInlineStyle}>
          No records
        </div>
      ) : (
        <div style={peopleGridStyle}>
          {people.map((person) => (
            <div
              key={person.id}
              style={personRowStyle}
            >
              <div style={{ minWidth: 0 }}>
                <div style={personNameStyle}>
                  {[
                    person.first_name,
                    person.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ") ||
                    person.email ||
                    "—"}
                </div>

                <div style={personMetaStyle}>
                  {person.email || "—"}
                </div>
              </div>

              <div style={personPhoneStyle}>
                {person.phone || "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <h2 style={sectionTitleStyle}>
        {title}
      </h2>

      {subtitle && (
        <div style={sectionSubtitleStyle}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default function ApartmentsPage() {
  const [searchParams] =
    useSearchParams();

  const { language } =
    useTranslation();

  const apartmentNumber =
    searchParams.get("number");

  const {
    apartments,
    loading,
    error,
    showCreateApartment,
    setShowCreateApartment,
    newApartment,
    setNewApartment,
    createApartment,
    loadApartments,
  } = useApartments();

  const [selectedSection, setSelectedSection] =
    useState(null);

  const [selectedFloor, setSelectedFloor] =
    useState(null);

  const [selectedApartment, setSelectedApartment] =
    useState(null);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadApartments();
  }, []);

  useEffect(() => {
    if (
      !apartmentNumber ||
      apartments.length === 0
    ) {
      return;
    }

    const apartment =
      apartments.find(
        (item) =>
          String(item.number) ===
          String(apartmentNumber)
      );

    if (!apartment) {
      return;
    }

    setSelectedSection(
      apartment.section
    );
    setSelectedFloor(
      apartment.floor
    );
    setSelectedApartment(
      apartment
    );
  }, [
    apartmentNumber,
    apartments,
  ]);

  const sections = useMemo(
    () =>
      [
        ...new Set(
          apartments
            .map((item) => item.section)
            .filter(
              (section) =>
                section !== null &&
                section !== undefined &&
                String(section).trim() !== ""
            )
        ),
      ].sort(compareValues),
    [apartments]
  );

  const sectionApartments = useMemo(
    () =>
      selectedSection === null
        ? []
        : apartments.filter(
            (item) =>
              String(item.section) ===
              String(selectedSection)
          ),
    [apartments, selectedSection]
  );

  const floors = useMemo(
    () =>
      [
        ...new Set(
          sectionApartments
            .map((item) => item.floor)
            .filter(
              (floor) =>
                floor !== null &&
                floor !== undefined
            )
        ),
      ].sort(compareValues),
    [sectionApartments]
  );

  const floorApartments = useMemo(
    () =>
      selectedFloor === null
        ? []
        : sectionApartments
            .filter(
              (item) =>
                String(item.floor) ===
                String(selectedFloor)
            )
            .sort((left, right) =>
              compareValues(
                left.number,
                right.number
              )
            ),
    [sectionApartments, selectedFloor]
  );

  const sectionSummary = useMemo(
    () => getSummary(sectionApartments),
    [sectionApartments]
  );

  const floorSummary = useMemo(
    () => getSummary(floorApartments),
    [floorApartments]
  );

  const searchResults = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return apartments
      .filter((apartment) => {
        const people = [
          ...(apartment.owners || []),
          ...(apartment.residents || []),
        ]
          .map((person) =>
            [
              person.first_name,
              person.last_name,
              person.email,
              person.phone,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
          )
          .join(" ");

        return (
          String(apartment.number)
            .toLowerCase()
            .includes(query) ||
          people.includes(query)
        );
      })
      .sort((left, right) =>
        compareValues(
          left.number,
          right.number
        )
      )
      .slice(0, 30);
  }, [apartments, search]);

  const selectSection = (section) => {
    setSelectedSection(section);
    setSelectedFloor(null);
    setSelectedApartment(null);
    setSearch("");
  };

  const selectFloor = (floor) => {
    setSelectedFloor(floor);
    setSelectedApartment(null);
  };

  const selectApartment = (apartment) => {
    setSelectedSection(
      apartment.section
    );
    setSelectedFloor(
      apartment.floor
    );
    setSelectedApartment(
      apartment
    );
  };

  return (
    <div className="apartments-page">
      <style>
        {`
          .apartments-page {
            width: 100%;
            max-width: 100%;
            min-width: 0;
          }

          .apartment-chip-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
          }

          .apartment-summary-grid {
            display: grid;
            grid-template-columns:
              repeat(3, minmax(110px, 1fr));
            gap: 8px;
            width: 100%;
            max-width: 520px;
          }

          .apartment-details-grid {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          @media (max-width: 700px) {
            .apartments-page {
              padding-top: 54px;
            }

            .apartments-page-header {
              align-items: stretch !important;
            }

            .apartments-page-header button {
              width: 100%;
            }

            .apartment-summary-grid {
              grid-template-columns:
                minmax(0, 1fr);
              max-width: none;
            }

            .apartment-details-grid {
              grid-template-columns:
                minmax(0, 1fr);
            }
          }
        `}
      </style>

      <div
        className="apartments-page-header"
        style={pageHeaderStyle}
      >
        <div>
          <h1 style={pageTitleStyle}>
            Apartments
          </h1>

          <div style={pageSubtitleStyle}>
            {apartments.length} apartments
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowCreateApartment(true)
          }
          style={primaryButtonStyle}
        >
          + Add Apartment
        </button>
      </div>

      {error && (
        <div role="alert" style={errorStyle}>
          {error}
        </div>
      )}

      {loading && (
        <div style={noticeStyle}>
          Loading apartments...
        </div>
      )}

      <section style={panelSpacingStyle}>
        <input
          type="search"
          placeholder="Apartment, owner or resident"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={inputStyle}
        />

        {search && (
          <div style={{ marginTop: 10 }}>
            {searchResults.length === 0 ? (
              <div style={emptyStyle}>
                No matching apartments
              </div>
            ) : (
              <div className="apartment-chip-grid">
                {searchResults.map(
                  (apartment) => (
                    <button
                      type="button"
                      key={apartment.id}
                      onClick={() =>
                        selectApartment(
                          apartment
                        )
                      }
                      style={chipButtonStyle(
                        selectedApartment?.id ===
                          apartment.id
                      )}
                    >
                      #{apartment.number}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <section style={panelSpacingStyle}>
        <SectionHeader
          title="Sections"
          subtitle="Select a building section"
        />

        <div className="apartment-chip-grid">
          {sections.map((section) => (
            <button
              type="button"
              key={section}
              onClick={() =>
                selectSection(section)
              }
              style={chipButtonStyle(
                String(selectedSection) ===
                  String(section)
              )}
            >
              {section}
            </button>
          ))}
        </div>
      </section>

      {selectedSection !== null && (
        <>
          <SummaryCard
            title={`Section ${selectedSection}`}
            subtitle="Selected section summary"
            summary={sectionSummary}
            language={language}
          />

          <section style={panelSpacingStyle}>
            <SectionHeader
              title="Floors"
              subtitle={`Section ${selectedSection}`}
            />

            <div className="apartment-chip-grid">
              {floors.map((floor) => (
                <button
                  type="button"
                  key={floor}
                  onClick={() =>
                    selectFloor(floor)
                  }
                  style={chipButtonStyle(
                    String(selectedFloor) ===
                      String(floor)
                  )}
                >
                  {floor}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {selectedFloor !== null && (
        <>
          <SummaryCard
            title={`Section ${selectedSection} · Floor ${selectedFloor}`}
            subtitle="Selected floor summary"
            summary={floorSummary}
            language={language}
          />

          <section style={panelSpacingStyle}>
            <SectionHeader
              title="Apartments"
              subtitle={`${floorApartments.length} on this floor`}
            />

            <div className="apartment-chip-grid">
              {floorApartments.map(
                (apartment) => (
                  <button
                    type="button"
                    key={apartment.id}
                    onClick={() =>
                      setSelectedApartment(
                        apartment
                      )
                    }
                    style={chipButtonStyle(
                      selectedApartment?.id ===
                        apartment.id
                    )}
                  >
                    #{apartment.number}
                  </button>
                )
              )}
            </div>
          </section>
        </>
      )}

      {selectedApartment && (
        <section style={panelSpacingStyle}>
          <div style={apartmentHeaderStyle}>
            <div>
              <h2 style={apartmentTitleStyle}>
                Apartment #{selectedApartment.number}
              </h2>

              <div style={apartmentSubtitleStyle}>
                Section {selectedApartment.section} · Floor {selectedApartment.floor}
              </div>
            </div>

            <span style={countBadgeStyle}>
              {getUniquePeopleCount([
                selectedApartment,
              ])} residents
            </span>
          </div>

          <div className="apartment-details-grid">
            <section style={subCardStyle}>
              <h3 style={subCardTitleStyle}>
                General
              </h3>

              <div style={infoGridStyle}>
                <InfoItem
                  label="Number"
                  value={selectedApartment.number}
                />
                <InfoItem
                  label="Section"
                  value={selectedApartment.section}
                />
                <InfoItem
                  label="Floor"
                  value={selectedApartment.floor}
                />
                <InfoItem
                  label="Rooms"
                  value={selectedApartment.room_count}
                />
                <InfoItem
                  label="Levels"
                  value={selectedApartment.level_count}
                />
                <InfoItem
                  label="Hot water risers"
                  value={selectedApartment.hot_water_riser_count}
                />
              </div>
            </section>

            <section style={subCardStyle}>
              <h3 style={subCardTitleStyle}>
                Areas
              </h3>

              <div style={infoGridStyle}>
                <InfoItem
                  label="Living"
                  value={`${formatArea(
                    selectedApartment.living_area,
                    language
                  )} m²`}
                />
                <InfoItem
                  label="Non-living"
                  value={`${formatArea(
                    selectedApartment.non_living_area,
                    language
                  )} m²`}
                />
                <InfoItem
                  label="Heated"
                  value={`${formatArea(
                    selectedApartment.heated_area,
                    language
                  )} m²`}
                />
                <InfoItem
                  label="Land tax"
                  value={`${formatArea(
                    selectedApartment.land_tax_area,
                    language
                  )} m²`}
                />
                <InfoItem
                  label="Alternative heating area"
                  value={`${formatArea(
                    selectedApartment.alternative_heating_area,
                    language
                  )} m²`}
                />
                <InfoItem
                  label="Alternative heating"
                  value={
                    Number(
                      selectedApartment.alternative_heating
                    ) === 1
                      ? "Yes"
                      : "No"
                  }
                />
              </div>
            </section>

            <PeopleList
              title="Owners"
              people={selectedApartment.owners || []}
            />

            <PeopleList
              title="Residents"
              people={selectedApartment.residents || []}
            />
          </div>

          {selectedApartment.notes && (
            <div style={notesStyle}>
              <strong style={{ color: "var(--text-h)" }}>
                Notes:
              </strong>{" "}
              {selectedApartment.notes}
            </div>
          )}
        </section>
      )}

      <Modal
        open={showCreateApartment}
        title="Create Apartment"
        onClose={() =>
          setShowCreateApartment(false)
        }
      >
        <div style={modalGridStyle}>
          <label style={labelStyle}>
            Number
            <input
              value={newApartment.number}
              onChange={(event) =>
                setNewApartment({
                  ...newApartment,
                  number: event.target.value,
                })
              }
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Section
            <input
              value={newApartment.section}
              onChange={(event) =>
                setNewApartment({
                  ...newApartment,
                  section: event.target.value,
                })
              }
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Floor
            <input
              type="number"
              value={newApartment.floor}
              onChange={(event) =>
                setNewApartment({
                  ...newApartment,
                  floor: event.target.value,
                })
              }
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Living area, m²
            <input
              type="number"
              step="0.01"
              value={newApartment.living_area}
              onChange={(event) =>
                setNewApartment({
                  ...newApartment,
                  living_area: event.target.value,
                })
              }
              style={inputStyle}
            />
          </label>

          <button
            type="button"
            onClick={createApartment}
            style={primaryButtonStyle}
          >
            Save Apartment
          </button>
        </div>
      </Modal>
    </div>
  );
}

const panelStyle = {
  padding: 14,
  border: "1px solid var(--border)",
  borderRadius: 12,
  background: "var(--surface)",
  boxShadow: "0 4px 14px rgba(15,23,42,.04)",
};

const panelSpacingStyle = {
  ...panelStyle,
  marginBottom: 12,
};

const summaryCardStyle = {
  ...panelStyle,
  display: "grid",
  gap: 12,
  marginBottom: 12,
  background: "var(--surface-soft)",
};

const metricStyle = {
  padding: 10,
  border: "1px solid var(--border)",
  borderRadius: 9,
  background: "var(--surface)",
};

const metricLabelStyle = {
  color: "var(--text)",
  fontSize: 9,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const metricValueStyle = {
  marginTop: 4,
  color: "var(--text-h)",
  fontSize: 17,
  fontWeight: 800,
  lineHeight: 1.1,
};

const summaryTitleStyle = {
  color: "var(--text-h)",
  fontSize: 16,
  fontWeight: 800,
};

const summarySubtitleStyle = {
  marginTop: 3,
  color: "var(--text)",
  fontSize: 11,
};

const subCardStyle = {
  padding: 13,
  border: "1px solid var(--border)",
  borderRadius: 10,
  background: "var(--surface-soft)",
};

const subCardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  marginBottom: 10,
};

const subCardTitleStyle = {
  margin: 0,
  color: "var(--text-h)",
  fontSize: 13,
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  gap: 7,
};

const infoItemStyle = {
  minWidth: 0,
  padding: 9,
  border: "1px solid var(--border)",
  borderRadius: 8,
  background: "var(--surface)",
};

const infoValueStyle = {
  marginTop: 4,
  color: "var(--text-h)",
  fontSize: 12,
  fontWeight: 700,
  overflowWrap: "anywhere",
};

const peopleGridStyle = {
  display: "grid",
  gap: 7,
};

const personRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  padding: 9,
  border: "1px solid var(--border)",
  borderRadius: 8,
  background: "var(--surface)",
};

const personNameStyle = {
  color: "var(--text-h)",
  fontSize: 11,
  fontWeight: 800,
};

const personMetaStyle = {
  marginTop: 2,
  color: "var(--text)",
  fontSize: 10,
  overflowWrap: "anywhere",
};

const personPhoneStyle = {
  color: "var(--text)",
  fontSize: 10,
  whiteSpace: "nowrap",
};

const countBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 24,
  padding: "3px 8px",
  border: "1px solid var(--border)",
  borderRadius: 999,
  background: "var(--surface-soft)",
  color: "var(--text-h)",
  fontSize: 10,
  fontWeight: 800,
};

const inputStyle = {
  width: "100%",
  minWidth: 0,
  minHeight: 39,
  boxSizing: "border-box",
  padding: "9px 11px",
  border: "1px solid var(--border)",
  borderRadius: 9,
  outline: "none",
  background: "var(--surface)",
  color: "var(--text-h)",
  font: "inherit",
  fontSize: 13,
};

const labelStyle = {
  display: "grid",
  gap: 5,
  color: "var(--text-h)",
  fontSize: 11,
  fontWeight: 700,
};

const primaryButtonStyle = {
  minHeight: 38,
  padding: "9px 13px",
  border: "1px solid #1d4ed8",
  borderRadius: 9,
  background: "#2563eb",
  color: "#ffffff",
  fontSize: 11,
  fontWeight: 800,
  cursor: "pointer",
};

function chipButtonStyle(active) {
  return {
    minWidth: 42,
    minHeight: 34,
    padding: "7px 10px",
    border: active
      ? "1px solid #2563eb"
      : "1px solid var(--border)",
    borderRadius: 8,
    background: active
      ? "rgba(37,99,235,.10)"
      : "var(--surface)",
    color: active
      ? "#1d4ed8"
      : "var(--text-h)",
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
  };
}

const pageHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 14,
  flexWrap: "wrap",
  marginBottom: 18,
};

const pageTitleStyle = {
  margin: 0,
  color: "var(--text-h)",
  fontSize: 32,
  lineHeight: 1.2,
};

const pageSubtitleStyle = {
  marginTop: 5,
  color: "var(--text)",
  fontSize: 12,
};

const sectionTitleStyle = {
  margin: 0,
  color: "var(--text-h)",
  fontSize: 15,
};

const sectionSubtitleStyle = {
  marginTop: 3,
  color: "var(--text)",
  fontSize: 10,
};

const apartmentHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 14,
};

const apartmentTitleStyle = {
  margin: 0,
  color: "var(--text-h)",
  fontSize: 20,
};

const apartmentSubtitleStyle = {
  marginTop: 4,
  color: "var(--text)",
  fontSize: 11,
};

const notesStyle = {
  marginTop: 10,
  padding: 11,
  border: "1px solid var(--border)",
  borderRadius: 9,
  background: "var(--surface-soft)",
  color: "var(--text)",
  fontSize: 11,
  whiteSpace: "pre-wrap",
};

const modalGridStyle = {
  display: "grid",
  gap: 10,
};

const errorStyle = {
  marginBottom: 12,
  padding: 12,
  border: "1px solid rgba(180,83,83,.28)",
  borderRadius: 9,
  background: "rgba(180,83,83,.06)",
  color: "#9f3f3f",
  fontSize: 11,
};

const noticeStyle = {
  marginBottom: 12,
  padding: 12,
  border: "1px solid var(--border)",
  borderRadius: 9,
  background: "var(--surface-soft)",
  color: "var(--text)",
  fontSize: 11,
};

const emptyStyle = {
  padding: 12,
  border: "1px dashed var(--border)",
  borderRadius: 9,
  color: "var(--text)",
  fontSize: 11,
  textAlign: "center",
};

const emptyInlineStyle = {
  color: "var(--text)",
  fontSize: 11,
};
