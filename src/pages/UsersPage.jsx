import { useEffect } from "react";
import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import useApartments from "../hooks/useApartments";

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


  return (
    <div>

      <h1>Users</h1>

      <button
        onClick={() => setShowCreateUser(true)}
        style={buttonStyle}
      >
        Add User
      </button>

{!isMobile ? (

  <table style={tableStyle}>

    <thead>
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Assignments</th>
      </tr>
    </thead>

    <tbody>

      {users.map((u) => (

        <tr key={u.id}>

          <td>{u.id}</td>
          <td>{u.first_name}</td>
          <td>{u.last_name}</td>
          <td>{u.email}</td>
          <td>{u.phone}</td>

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

    {users.map((u) => (

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
            marginTop: 6,
            color: "#6b7280",
          }}
        >
          {u.email}
        </div>

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
        {selectedUser.email}
      </p>

      <p>
        <b>Phone:</b>
        {" "}
        {selectedUser.phone}
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
