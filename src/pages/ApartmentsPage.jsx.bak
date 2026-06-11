import { useEffect, useMemo, useState } from "react";
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
        padding: "10px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <strong>{label}</strong>

      <span
        style={{
          textAlign: "right",
        }}
      >
        {String(value ?? "")}
      </span>
    </div>
  );
}

export default function ApartmentsPage() {

  const {
    apartments,

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
    navigationSource,
    setNavigationSource,
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

  useEffect(() => {
    loadApartments();
  }, []);

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
          Number(a.number) -
          Number(b.number)
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

      <button
        onClick={() =>
          setShowCreateApartment(true)
        }
        style={buttonStyle}
      >
        Add Apartment
      </button>

      <hr />

      <h2>
        Search
      </h2>

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

        <div style={cardStyle}>

          <h3>
            Search Results
          </h3>

          {searchResults.map(
            (a) => (

              <button
                key={a.id}
                style={{
                  margin: 5,
                }}
                onClick={() => {

                  setNavigationSource(
                    "search"
                  );

                  setSelectedSection(
                    null
                  );

                  setSelectedFloor(
                    null
                  );

                  setSelectedApartment(
                    a
                  );
                }}
              >
                Apt #{a.number}
              </button>

            )
          )}

          {searchResults.length ===
            0 && (
            <p>
              No matches
            </p>
          )}

        </div>

      )}

      <hr />

      <h2>
        Sections
      </h2>

      {sections.map(
        (section) => (

          <button
            key={section}
            style={{
              ...buttonStyle,
              marginRight: 10,
              marginBottom: 10,
            }}
            onClick={() => {

              setSearch("");

              setNavigationSource(
                "tree"
              );

              setSelectedSection(
                section
              );

              setSelectedFloor(
                null
              );

              setSelectedApartment(
                null
              );
            }}
          >
            Section {section}
          </button>

        )
      )}

      {selectedSection && (

        <>
          <hr />

          <h2>
            Floors
          </h2>

          {floors.map(
            (floor) => (

              <button
                key={floor}
                style={{
                  ...buttonStyle,
                  marginRight: 10,
                  marginBottom: 10,
                }}
                onClick={() => {

                  setSelectedFloor(
                    floor
                  );

                  setSelectedApartment(
                    null
                  );
                }}
              >
                Floor {floor}
              </button>

            )
          )}

        </>

      )}

      {selectedFloor !== null && (

        <>
          <hr />

          <h2>
            Apartments
          </h2>

          {floorApartments.map(
            (a) => (

              <button
                key={a.id}
                style={{
                  ...buttonStyle,
                  margin: 5,
                }}
                onClick={() => {

                  setNavigationSource(
                    "tree"
                  );

                  setSelectedApartment(
                    a
                  );
                }}
              >
                #{a.number}
              </button>

            )
          )}

        </>

      )}

      {selectedApartment && (

        <div
          style={{
            ...cardStyle,
            marginTop: 20,
            maxWidth: 900,
          }}
        >

          <h2>
            Apartment #
            {selectedApartment.number}
          </h2>

          {navigationSource ===
            "tree" && (
            <div
              style={{
                marginBottom: 20,
                color: "#666",
              }}
            >
              Section{" "}
              {
                selectedApartment.section
              }
              {" → "}
              Floor{" "}
              {
                selectedApartment.floor
              }
              {" → "}
              Apartment{" "}
              {
                selectedApartment.number
              }
            </div>
          )}

          <InfoField
            label="Section"
            value={
              selectedApartment.section
            }
          />

          <InfoField
            label="Floor"
            value={
              selectedApartment.floor
            }
          />

          <InfoField
            label="Living Area"
            value={
              selectedApartment.living_area
            }
          />

          <InfoField
            label="Non Living Area"
            value={
              selectedApartment.non_living_area
            }
          />

          <InfoField
            label="Heated Area"
            value={
              selectedApartment.heated_area
            }
          />

          <InfoField
            label="Residents Count"
            value={
              selectedApartment.residents_count
            }
          />

          <InfoField
            label="Levels"
            value={
              selectedApartment.level_count
            }
          />

          <InfoField
            label="Rooms"
            value={
              selectedApartment.room_count
            }
          />

          <InfoField
            label="Land Tax Area"
            value={
              selectedApartment.land_tax_area
            }
          />

          <InfoField
            label="Alternative Heating"
            value={
              selectedApartment.alternative_heating
            }
          />

          <InfoField
            label="Alternative Heating Area"
            value={
              selectedApartment.alternative_heating_area
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

          <hr />

          <button
            style={buttonStyle}
            onClick={() =>
              setOpenOwners(
                !openOwners
              )
            }
          >
            Owners (
            {
              selectedApartment
                .owners?.length
            }
            )
          </button>

          {openOwners && (

            <>
              {(selectedApartment.owners ||
                []).map((o) => (

                <div
                  key={o.id}
                  style={{
                    marginTop: 10,
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
                  {o.email}

                  <br />

                  Phone:
                  {" "}
                  {o.phone || "-"}
                </div>

              ))}
            </>

          )}

          <hr />

          <button
            style={buttonStyle}
            onClick={() =>
              setOpenResidents(
                !openResidents
              )
            }
          >
            Residents (
            {
              selectedApartment
                .residents?.length
            }
            )
          </button>

          {openResidents && (

            <>
              {(selectedApartment.residents ||
                []).map((r) => (

                <div
                  key={r.id}
                  style={{
                    marginTop: 10,
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
                  {r.email}

                  <br />

                  Phone:
                  {" "}
                  {r.phone || "-"}
                </div>

              ))}
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
              number:
                e.target.value,
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
              section:
                e.target.value,
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
              floor:
                e.target.value,
            })
          }
          style={inputStyle}
        />

        <button
          onClick={
            createApartment
          }
          style={buttonStyle}
        >
          Save Apartment
        </button>

      </Modal>

    </div>
  );
}