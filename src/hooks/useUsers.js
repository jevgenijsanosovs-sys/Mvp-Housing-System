import { useState } from "react";

import { api } from "../services/api";

export function useUsers() {

  const [users, setUsers] =
    useState([]);

  const [assignmentUser,
    setAssignmentUser] =
    useState(null);

  const [
    assignmentApartmentId,
    setAssignmentApartmentId,
  ] = useState("");

  const [
    assignmentRelation,
    setAssignmentRelation,
  ] = useState("owner");

  const [
    userAssignments,
    setUserAssignments,
  ] = useState([]);

  const [
    showCreateUser,
    setShowCreateUser,
  ] = useState(false);

  const [newUser, setNewUser] =
    useState({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    });

  const loadUsers = async () => {

    const d = await api(
      "/api/admin/users"
    );

    setUsers(
      Array.isArray(d) ? d : []
    );
  };

  const loadUserAssignments =
    async (userId) => {

      const d = await api(
        "/api/admin/user-apartments?user_id=" +
        userId
      );

      setUserAssignments(
        Array.isArray(d) ? d : []
      );
    };

  const createUser = async () => {

    const res = await api(
      "/api/admin/create-user",
      {
        method: "POST",

        body: JSON.stringify(
          newUser
        ),
      }
    );

    if (res.ok) {

      alert("User created");

      setShowCreateUser(false);

      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });

      loadUsers();

    } else {

      alert(
        res.error ||
        "Create failed"
      );

    }
  };

  const addAssignment =
    async () => {

      if (
        !assignmentUser ||
        !assignmentApartmentId
      ) {
        return;
      }

      const r = await api(
        "/api/admin/add-user-apartment",
        {
          method: "POST",

          body: JSON.stringify({
            user_id:
              assignmentUser.id,

            apartment_id:
              assignmentApartmentId,

            relation_type:
              assignmentRelation,
          }),
        }
      );

      if (r.ok) {

        await loadUserAssignments(
          assignmentUser.id
        );

        alert(
          "Assignment added"
        );

      } else {

        alert(
          r.error ||
          "Assignment failed"
        );

      }
    };

  const removeAssignment =
    async (assignmentId) => {

      const r = await api(
        "/api/admin/remove-user-apartment",
        {
          method: "POST",

          body: JSON.stringify({
            assignment_id:
              assignmentId,
          }),
        }
      );

      if (r.ok) {

        await loadUserAssignments(
          assignmentUser.id
        );

      } else {

        alert(
          r.error ||
          "Remove failed"
        );

      }
    };

  return {

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
  };
}
