import { useEffect } from "react";
import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import useApartments from "../hooks/useApartments";
import { useNavigate } from "react-router-dom";
import {
  buttonStyle,
  menuButton,
  tableStyle,
  modalStyle,
  modalContentStyle,
  inputStyle,
} from "../styles/theme";

import Modal from "../components/Modal";


export default function UsersPage() {

  const [selectedUser, setSelectedUser] =
    useState(null);
  
  const isMobile =
    window.innerWidth < 768;

  const [search, setSearch] =
  useState("");
  
  const {
    users,
    loadUsers,

    assignmentUser,
    setAssignmentUser,

    assignmentApartmentId,
    setAssignmentApartmentId,

    assignmentRelation,
    setAssignmentRelation,

    userAssignments,
    setUserAssignments,

    showCreateUser,
    setShowCreateUser,

    newUser,
    setNewUser,

    createUser,

    loadUserAssignments,

    addAssignment,

    removeAssignment,
  } = useUsers();

  const {
    apartments,
    loadApartments,
  } = useApartments();

  useEffect(() => {
    loadUsers();
  }, []);

  const openApartment = (aptNumber) => {
    navigate(`/apartments?number=${aptNumber}`);
  };

   
  const navigate = useNavigate();

  const filteredUsers = users.filter(
    (u) => {
  
      const text = `
        ${u.first_name || ""}
        ${u.last_name || ""}
        ${u.email || ""}
        ${u.phone || ""}
        ${u.owner_apartments || ""}
        ${u.resident_apartments || ""}
      `
        .toLowerCase();
  
      return text.includes(
        search.toLowerCase()
      );
    }
  );
  
  const ApartmentChips = ({ apartments }) => {
    if (!apartments) return null;
  
    return (
      <>
        {apartments
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
          .map((apt) => (
            <button
              key={apt}
              onClick={() => openApartment(apt)}
              style={{
                marginRight: 6,
                marginBottom: 6,
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid #d1d5db",
                background: "#f3f4f6",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {apt}
            </button>
          ))}
      </>
    );
  };
  
  return (
    <div>

<div
  style={{
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "#f3f4f6",
    paddingBottom: 12,
    marginBottom: 20,
  }}
>

  <div
    style={{
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >

    <h1
      style={{
        margin: 0,
      }}
    >
      Users
    </h1>

    <input
      placeholder="Search..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      style={{
        flex: 1,
        minWidth: 180,
        padding: 10,
        borderRadius: 10,
        border: "1px solid #ccc",
      }}
    />

    <button
      onClick={() =>
        setShowCreateUser(true)
      }
      style={{
        padding: "10px 16px",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
      }}
    >
      Add User
    </button>

  </div>

</div>

{!isMobile ? (

  <table style={tableStyle}>

    <thead>
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Apartments</th>
        <th>Assignments</th>
      </tr>
    </thead>

    <tbody>

      {filteredUsers.map((u) => (

        <tr key={u.id}>

          <td>{u.id}</td>
          <td>{u.first_name}</td>
          <td>{u.last_name}</td>

          <td>
          
            <a
              href={`mailto:${u.email}`}
            >
              {u.email}
            </a>
          
          </td>
          
          <td>
          
            <a
              href={`tel:${u.phone}`}
            >
              {u.phone}
            </a>
          
          </td>
          
          <td>
          
            {u.owner_apartments && (
              <ApartmentChips
                apartments={u.owner_apartments}
              />
            )}
          
            {u.resident_apartments && (
              <ApartmentChips
                apartments={u.resident_apartments}
              />
            )}
          
          </td>
          
          <td>

            <button
              style={menuButton}
              onClick={async () => {

                await loadApartments();

                setAssignmentUser(u);

                await loadUserAssignments(
                  u.id
                );

              }}
            >
              Assign Apartment
            </button>

          </td>

        </tr>

      ))}

    </tbody>

  </table>

) : (

  <div>

    {filteredUsers.map((u) => (

      <div
        key={u.id}
        onClick={() =>
          setSelectedUser(u)
        }
        style={{
          background: "white",
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          textAlign: "left",
          cursor: "pointer",
        }}
      >

        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {u.first_name}
          {" "}
          {u.last_name}
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 14,
          }}
        >
          {u.owner_apartments && (
            <>
              <div
                style={{
                  color: "#6b7280",
                  marginBottom: 4,
                }}
              >
                Owner
              </div>
        
              <ApartmentChips
                apartments={u.owner_apartments}
              />
            </>
          )}
        
          {u.resident_apartments && (
            <>
              <div
                style={{
                  color: "#6b7280",
                  marginTop: 8,
                  marginBottom: 4,
                }}
              >
                Resident
              </div>
        
              <ApartmentChips
                apartments={u.resident_apartments}
              />
            </>
          )}
        </div>
        
          {!u.owner_apartments &&
            !u.resident_apartments &&
            "No apartments"}

        <button
          style={{
            ...menuButton,
            marginTop: 12,
            width: "100%",
          }}
          onClick={async (e) => {
        
            e.stopPropagation();
        
            await loadApartments();
        
            setAssignmentUser(u);
        
            await loadUserAssignments(
              u.id
            );
        
          }}
        >
          Assign Apartment
        </button>


        </div>
    ))}

  </div>

)}

<Modal
  open={!!selectedUser}
  title="User Information"
  onClose={() =>
    setSelectedUser(null)
  }
>

  {selectedUser && (

    <div
      style={{
        textAlign: "left",
      }}
    >

      <p>
        <b>First Name:</b>
        {" "}
        {selectedUser.first_name}
      </p>

      <p>
        <b>Last Name:</b>
        {" "}
        {selectedUser.last_name}
      </p>

      <p>
        <b>Email:</b>
        {" "}
        <a
          href={`mailto:${selectedUser.email}`}
        >
          {selectedUser.email}
        </a>
      </p>

      <p>
        <b>Phone:</b>
        {" "}
        <a
          href={`tel:${selectedUser.phone}`}
        >
          {selectedUser.phone}
        </a>
      
        {" | "}
      
        <a
          href={`https://wa.me/${selectedUser.phone.replace(/\D/g,"")}`}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </p>

      <p>
        <b>Owner:</b>
        {selectedUser.owner_apartments}
      </p>
      <p>
        <b>Resident:</b>
        {selectedUser.resident_apartments}
      </p>
      
    </div>

  )}

</Modal>
      
{/* CREATE USER MODAL */}

<Modal
  open={showCreateUser}
  title="Create User"
  onClose={() =>
    setShowCreateUser(false)
  }
>

  <input
    placeholder="First Name"
    value={newUser.first_name}
    onChange={(e) =>
      setNewUser({
        ...newUser,
        first_name: e.target.value,
      })
    }
    style={inputStyle}
  />

  <input
    placeholder="Last Name"
    value={newUser.last_name}
    onChange={(e) =>
      setNewUser({
        ...newUser,
        last_name: e.target.value,
      })
    }
    style={inputStyle}
  />

  <input
    placeholder="Email"
    value={newUser.email}
    onChange={(e) =>
      setNewUser({
        ...newUser,
        email: e.target.value,
      })
    }
    style={inputStyle}
  />

  <input
    placeholder="Phone"
    value={newUser.phone}
    onChange={(e) =>
      setNewUser({
        ...newUser,
        phone: e.target.value,
      })
    }
    style={inputStyle}
  />

  <input
    placeholder="Password"
    value={newUser.password}
    onChange={(e) =>
      setNewUser({
        ...newUser,
        password: e.target.value,
      })
    }
    style={inputStyle}
  />

  <button
    onClick={createUser}
    style={buttonStyle}
  >
    Create User
  </button>

</Modal>

{/* ASSIGNMENT MODAL */}

{assignmentUser && (

  <div style={modalStyle}>

    <div style={modalContentStyle}>

      <h2>Assign Apartment</h2>

      <p>
        User:
        {" "}
        {assignmentUser.first_name}
        {" "}
        {assignmentUser.last_name}
      </p>

      <select
        value={assignmentApartmentId}
        onChange={(e) =>
          setAssignmentApartmentId(
            e.target.value
          )
        }
        style={inputStyle}
      >

        <option value="">
          Select apartment
        </option>

        {apartments.map((a) => (

          <option
            key={a.id}
            value={a.id}
          >
            Apartment #{a.number}
          </option>

        ))}

      </select>

      <select
        value={assignmentRelation}
        onChange={(e) =>
          setAssignmentRelation(
            e.target.value
          )
        }
        style={inputStyle}
      >

        <option value="owner">
          owner
        </option>

        <option value="resident">
          resident
        </option>

      </select>

      <button
        onClick={addAssignment}
        style={buttonStyle}
      >
        Save
      </button>

      <button
        onClick={() => {

          setAssignmentUser(null);

          setAssignmentApartmentId("");

          setUserAssignments([]);

        }}
        style={menuButton}
      >
        Cancel
      </button>

      <hr />

      <h3>
        Existing Assignments
      </h3>

      {userAssignments.map((x) => (

        <div
          key={x.id}
          style={{
            marginBottom: 10,
          }}
        >

          Apartment #{x.number}
          {" "}
          ({x.relation_type})

          <button
            style={{
              marginLeft: 10,
            }}
            onClick={() =>
              removeAssignment(x.id)
            }
          >
            Remove
          </button>

        </div>

      ))}

    </div>

  </div>

)}

    </div>
  );
}
