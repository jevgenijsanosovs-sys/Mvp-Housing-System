import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import useApartments from "../hooks/useApartments";

import Modal from "../components/Modal";

import {
  buttonStyle,
  cardStyle,
  inputStyle,
} from "../styles/theme";

function InfoField({
  label,
  value,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <strong>
        {label}
      </strong>

      <span
        style={{
          textAlign: "right",
          maxWidth: "60%",
          overflowWrap: "break-word",
        }}
      >
        {String(value ?? "")}
      </span>
    </div>
  );
}

export default function ApartmentsPage() {

  const [searchParams] = useSearchParams();
  
  const apartmentNumber =
    searchParams.get("number");
  
  const {
    apartments,
    loading,

    showCreateApartment,
    setShowCreateApartment,

    newApartment,
    setNewApartment,

    createApartment,

    loadApartments,
  } = useApartments();

  const [
    selectedSection,
    setSelectedSection,
  ] = useState(null);

  const [
    selectedFloor,
    setSelectedFloor,
  ] = useState(null);

  const [
    selectedApartment,
    setSelectedApartment,
  ] = useState(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    openOwners,
    setOpenOwners,
  ] = useState(true);

  const [
    openResidents,
    setOpenResidents,
  ] = useState(true);

  // =========================
  // MAIN ACCORDION
  // =========================

  const [
    accordion,
    setAccordion,
  ] = useState("sections");

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
        (a) =>
          String(a.number) ===
          String(apartmentNumber)
      );
  
    if (!apartment) {
      return;
    }
  
    setSelectedApartment(apartment);
  
    setSelectedSection(
      apartment.section
    );
  
    setSelectedFloor(
      apartment.floor
    );
  
    setAccordion("card");
  
  }, [
    apartmentNumber,
    apartments,
  ]);

  // =========================
  // DATA
  // =========================

  const sections = useMemo(() => {

    return [
      ...new Set(
        apartments.map(
          (a) => a.section
        )
      ),
    ].sort();

  }, [apartments]);

  const floors = useMemo(() => {

    return [
      ...new Set(
        apartments
          .filter(
            (a) =>
              a.section ===
              selectedSection
          )
          .map(
            (a) => a.floor
          )
      ),
    ].sort(
      (a, b) => a - b
    );

  }, [
    apartments,
    selectedSection,
  ]);

  const floorApartments =
    apartments
      .filter(
        (a) =>
          a.section ===
            selectedSection &&
          a.floor ===
            selectedFloor
      )
      .sort(
        (a, b) =>
          String(a.number)
            .localeCompare(
              String(b.number),
              undefined,
              {
                numeric: true,
              }
            )
      );

  const searchResults =
    apartments.filter((a) => {

      const q =
        search.toLowerCase();

      if (!q) {
        return false;
      }

      const owners =
        (a.owners || [])
          .map(
            (o) =>
              `${o.first_name} ${o.last_name}`
                .toLowerCase()
          )
          .join(" ");

      const residents =
        (a.residents || [])
          .map(
            (r) =>
              `${r.first_name} ${r.last_name}`
                .toLowerCase()
          )
          .join(" ");

      return (
        String(a.number)
          .toLowerCase()
          .includes(q) ||

        owners.includes(q) ||

        residents.includes(q)
      );

    });

  return (

  <div>

    <h1>
      Apartments
    </h1>

    {loading && (

      <div
        style={{
          ...cardStyle,
          background: "#fff3cd",
          color: "#000",
        }}
      >
        ⏳ Loading apartments...
      </div>

    )}

    <button
      onClick={() =>
        setShowCreateApartment(true)
      }
      style={buttonStyle}
    >
      Add Apartment
    </button>

    {/* SEARCH */}

    <div
      style={{
        ...cardStyle,
        marginTop: 15,
      }}
    >

      <div
        onClick={() =>
          setAccordion(
            accordion === "search"
              ? null
              : "search"
          )
        }
        style={{
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {accordion === "search"
          ? "▼"
          : "►"} Search
      </div>

      {accordion === "search" && (

        <div
          style={{
            marginTop: 15,
          }}
        >

          <input
            placeholder="Apartment, owner or resident"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={inputStyle}
          />

          {search && (

            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >

              {searchResults.map(
                (a) => (

                  <button
                    key={a.id}
                    style={{
                      ...buttonStyle,
                      width: "auto",
                      margin: 0,
                    }}
                    onClick={() => {

                      setSelectedSection(
                        null
                      );

                      setSelectedFloor(
                        null
                      );

                      setSelectedApartment(
                        a
                      );

                      setAccordion(
                        "card"
                      );

                    }}
                  >
                    #{a.number}
                  </button>

                )
              )}

            </div>

          )}

        </div>

      )}

    </div>

    {/* SECTIONS */}

    <div style={cardStyle}>

      <div
        onClick={() =>
          setAccordion(
            accordion === "sections"
              ? null
              : "sections"
          )
        }
        style={{
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {accordion === "sections"
          ? "▼"
          : "►"} Sections
      </div>

      {accordion === "sections" && (

        <div
          style={{
            marginTop: 15,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >

          {sections.map(
            (section) => (

              <button
                key={section}
                style={{
                  ...buttonStyle,
                  width: "auto",
                  margin: 0,
                }}
                onClick={() => {

                  setSearch("");

                  setSelectedSection(
                    section
                  );

                  setSelectedFloor(
                    null
                  );

                  setSelectedApartment(
                    null
                  );

                  setAccordion(
                    "floors"
                  );

                }}
              >
                {section}
              </button>

            )
          )}

        </div>

      )}

    </div>

    {/* FLOORS */}

    {selectedSection && (

      <div style={cardStyle}>

        <div
          onClick={() =>
            setAccordion(
              accordion === "floors"
                ? null
                : "floors"
            )
          }
          style={{
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {accordion === "floors"
            ? "▼"
            : "►"} Floors
        </div>

        {accordion === "floors" && (

          <div
            style={{
              marginTop: 15,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >

            {floors.map(
              (floor) => (

                <button
                  key={floor}
                  style={{
                    ...buttonStyle,
                    width: "auto",
                    margin: 0,
                  }}
                  onClick={() => {

                    setSelectedFloor(
                      floor
                    );

                    setSelectedApartment(
                      null
                    );

                    setAccordion(
                      "apartments"
                    );

                  }}
                >
                  {floor}
                </button>

              )
            )}

          </div>

        )}

      </div>

    )}

    {/* APARTMENTS */}

    {selectedFloor !== null && (

      <div style={cardStyle}>

        <div
          onClick={() =>
            setAccordion(
              accordion === "apartments"
                ? null
                : "apartments"
            )
          }
          style={{
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {accordion === "apartments"
            ? "▼"
            : "►"} Apartments
        </div>

        {accordion === "apartments" && (

          <div
            style={{
              marginTop: 15,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >

            {floorApartments.map(
              (a) => (

                <button
                  key={a.id}
                  style={{
                    ...buttonStyle,
                    width: "auto",
                    margin: 0,
                  }}
                  onClick={() => {

                    setSelectedApartment(
                      a
                    );

                    setAccordion(
                      "card"
                    );

                  }}
                >
                  #{a.number}
                </button>

              )
            )}

          </div>

        )}

      </div>

    )}

    {selectedApartment && (

      <div style={cardStyle}>

        <div
          onClick={() =>
            setAccordion(
              accordion === "card"
                ? null
                : "card"
            )
          }
          style={{
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {accordion === "card"
            ? "▼"
            : "►"} Apartment #{selectedApartment.number}
        </div>

        {accordion === "card" && (

          <>

            <div
              style={{
                marginTop: 15,
                background: "#f8fafc",
                borderRadius: 12,
                padding: 15,
              }}
            >

              <h3>
                General Information
              </h3>

              <InfoField
                label="Number"
                value={selectedApartment.number}
              />

              <InfoField
                label="Section"
                value={selectedApartment.section}
              />

              <InfoField
                label="Floor"
                value={selectedApartment.floor}
              />

              <InfoField
                label="Rooms"
                value={selectedApartment.room_count}
              />

              <InfoField
                label="Residents"
                value={selectedApartment.residents_count}
              />

              <InfoField
                label="Levels"
                value={selectedApartment.level_count}
              />

            </div>

            <div
              style={{
                marginTop: 15,
                background: "#f8fafc",
                borderRadius: 12,
                padding: 15,
              }}
            >

              <h3>
                Areas
              </h3>

              <InfoField
                label="Living Area"
                value={selectedApartment.living_area}
              />

              <InfoField
                label="Non Living Area"
                value={selectedApartment.non_living_area}
              />

              <InfoField
                label="Heated Area"
                value={selectedApartment.heated_area}
              />

              <InfoField
                label="Land Tax Area"
                value={selectedApartment.land_tax_area}
              />

              <InfoField
                label="Alternative Heating Area"
                value={
                  selectedApartment.alternative_heating_area
                }
              />

            </div>

            <div
              style={{
                marginTop: 15,
                background: "#f8fafc",
                borderRadius: 12,
                padding: 15,
              }}
            >

              <h3>
                Technical
              </h3>

              <InfoField
                label="Alternative Heating"
                value={
                  selectedApartment.alternative_heating
                    ? "Yes"
                    : "No"
                }
              />

              <InfoField
                label="Hot Water Risers"
                value={
                  selectedApartment.hot_water_riser_count
                }
              />

              <InfoField
                label="Created"
                value={
                  selectedApartment.created_at
                }
              />

              <InfoField
                label="Updated"
                value={
                  selectedApartment.updated_at
                }
              />

              <InfoField
                label="Notes"
                value={
                  selectedApartment.notes
                }
              />

            </div>

            {/* OWNERS */}

            <div
              style={{
                marginTop: 15,
                background: "#f8fafc",
                borderRadius: 12,
                padding: 15,
              }}
            >

              <div
                onClick={() =>
                  setOpenOwners(
                    !openOwners
                  )
                }
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {openOwners
                  ? "▼"
                  : "►"} Owners
              </div>

              {openOwners && (

                <div
                  style={{
                    marginTop: 10,
                  }}
                >

                  {(selectedApartment.owners || [])
                    .map((o) => (

                      <div
                        key={o.id}
                        style={{
                          borderBottom:
                            "1px solid #ddd",
                          padding:
                            "10px 0",
                        }}
                      >

                        <strong>
                          {o.first_name}
                          {" "}
                          {o.last_name}
                        </strong>

                        <br />

                        Email:
                        {" "}
                        {o.email || "-"}

                        <br />

                        Phone:
                        {" "}
                        {o.phone || "-"}

                      </div>

                    ))}

                </div>

              )}

            </div>

            {/* RESIDENTS */}

            <div
              style={{
                marginTop: 15,
                background: "#f8fafc",
                borderRadius: 12,
                padding: 15,
              }}
            >

              <div
                onClick={() =>
                  setOpenResidents(
                    !openResidents
                  )
                }
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {openResidents
                  ? "▼"
                  : "►"} Residents
              </div>

              {openResidents && (

                <div
                  style={{
                    marginTop: 10,
                  }}
                >

                  {(selectedApartment.residents || [])
                    .map((r) => (

                      <div
                        key={r.id}
                        style={{
                          borderBottom:
                            "1px solid #ddd",
                          padding:
                            "10px 0",
                        }}
                      >

                        <strong>
                          {r.first_name}
                          {" "}
                          {r.last_name}
                        </strong>

                        <br />

                        Email:
                        {" "}
                        {r.email || "-"}

                        <br />

                        Phone:
                        {" "}
                        {r.phone || "-"}

                      </div>

                    ))}

                </div>

              )}

            </div>

          </>

        )}

      </div>

    )}

    <Modal
      open={showCreateApartment}
      title="Create Apartment"
      onClose={() =>
        setShowCreateApartment(false)
      }
    >

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

      <button
        onClick={createApartment}
        style={buttonStyle}
      >
        Save Apartment
      </button>

    </Modal>

  </div>

);

}


