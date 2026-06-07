import { useEffect, useMemo, useState } from "react";
import useApartments from "../hooks/useApartments";

import Modal from "../components/Modal";

import {
  buttonStyle,
  cardStyle,
  inputStyle,
} from "../styles/theme";

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

  const [selectedSection,
    setSelectedSection] = useState(null);

  const [selectedFloor,
    setSelectedFloor] = useState(null);

  const [selectedApartment,
    setSelectedApartment] = useState(null);

  const [search,
    setSearch] = useState("");

  useEffect(() => {
    loadApartments();
  }, []);

  // =========================
  // SECTIONS
  // =========================

  const sections = useMemo(() => {

    return [
      ...new Set(
        apartments.map(a => a.section)
      ),
    ].sort();

  }, [apartments]);

  // =========================
  // FLOORS
  // =========================

  const floors = useMemo(() => {

    return [
      ...new Set(
        apartments
          .filter(
            a =>
              a.section === selectedSection
          )
          .map(a => a.floor)
      ),
    ].sort((a, b) => a - b);

  }, [apartments, selectedSection]);

  // =========================
  // APARTMENTS ON FLOOR
  // =========================

  const floorApartments =
    apartments
      .filter(
        a =>
          a.section === selectedSection &&
          a.floor === selectedFloor
      )
      .sort(
        (a, b) =>
          Number(a.number) -
          Number(b.number)
      );

  // =========================
  // SEARCH
  // =========================

  const searchResults =
    apartments.filter((a) => {

      const q =
        search.toLowerCase();

      if (!q) return false;

      const owners =
        (a.owners || [])
          .map(o =>
            `${o.first_name} ${o.last_name}`
              .toLowerCase()
          )
          .join(" ");

      const residents =
        (a.residents || [])
          .map(r =>
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

      <h1>Apartments</h1>

      <button
        onClick={() =>
          setShowCreateApartment(true)
        }
        style={buttonStyle}
      >
        Add Apartment
      </button>

      <hr />

      <h2>Search Apartment</h2>

      <input
        placeholder="Apartment number, owner or resident"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={inputStyle}
      />

      {search && (

        <div style={cardStyle}>

          <h3>Search Results</h3>

          {searchResults.map((a) => (

            <button
              key={a.id}
              style={{
                margin: 5,
              }}
              onClick={() =>
                setSelectedApartment(a)
              }
            >
              Apt #{a.number}
            </button>

          ))}

          {searchResults.length === 0 && (
            <p>No matches</p>
          )}

        </div>

      )}

      <hr />

      <h2>Sections</h2>

      {sections.map((section) => (

        <button
          key={section}
          style={{
            ...buttonStyle,
            marginRight: 10,
          }}
          onClick={() => {

            setSelectedSection(
              section
            );

            setSelectedFloor(null);

            setSelectedApartment(
              null
            );
          }}
        >
          Section {section}
        </button>

      ))}

      {selectedSection && (

        <>
          <hr />

          <h2>
            Floors of Section
            {" "}
            {selectedSection}
          </h2>

          {floors.map((floor) => (

            <button
              key={floor}
              style={{
                ...buttonStyle,
                marginRight: 10,
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

          ))}
        </>

      )}

      {selectedFloor !== null && (

        <>
          <hr />

          <h2>
            Apartments
          </h2>

          {floorApartments.map((a) => (

            <button
              key={a.id}
              style={{
                ...buttonStyle,
                margin: 5,
              }}
              onClick={() =>
                setSelectedApartment(a)
              }
            >
              #{a.number}
            </button>

          ))}
        </>

      )}

      {selectedApartment && (

        <div
          style={{
            ...cardStyle,
            marginTop: 20,
          }}
        >

          <h2>
            Apartment #
            {selectedApartment.number}
          </h2>

          <table>

            <tbody>

              {Object.entries(
                selectedApartment
              )
                .filter(
                  ([key]) =>
                    key !== "owners" &&
                    key !== "residents"
                )
                .map(
                  ([key, value]) => (
                    <tr key={key}>
                      <td>
                        <strong>
                          {key}
                        </strong>
                      </td>

                      <td>
                        {String(value)}
                      </td>
                    </tr>
                  )
                )}

            </tbody>

          </table>

          <hr />

          <h3>Owners</h3>

          {(selectedApartment.owners || [])
            .map(o => (

              <div key={o.id}>

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

          <hr />

          <h3>Residents</h3>

          {(selectedApartment.residents || [])
            .map(r => (

              <div key={r.id}>

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