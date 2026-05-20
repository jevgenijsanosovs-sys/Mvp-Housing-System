import { useState } from "react";
import { api } from "../services/api";

export default function useApartments() {

  const [apartments, setApartments] =
    useState([]);

  const [showCreateApartment, setShowCreateApartment] =
    useState(false);

  const [newApartment, setNewApartment] =
    useState({
      number: "",
      section: "",
      floor: "",
      level_count: 1,
      living_area: "",
      non_living_area: "",
      heated_area: "",
      notes: "",
    });

  // =========================
  // LOAD APARTMENTS
  // =========================

  const loadApartments = async () => {

    const d = await api(
      "/api/apartments/full"
    );

    setApartments(
      Array.isArray(d) ? d : []
    );
  };

  // =========================
  // CREATE APARTMENT
  // =========================

  const createApartment = async () => {

    const res = await api(
      "/api/admin/create-apartment",
      {
        method: "POST",

        body: JSON.stringify(newApartment),
      }
    );

    if (res.ok) {

      alert("Apartment created");

      setShowCreateApartment(false);

      setNewApartment({
        number: "",
        section: "",
        floor: "",
        living_area: "",
        heated_area: "",
        level_count: 1,
        notes: "",
      });

      loadApartments();

    } else {

      alert(
        res.error || "Create failed"
      );

    }
  };

  return {

    apartments,
    setApartments,

    showCreateApartment,
    setShowCreateApartment,

    newApartment,
    setNewApartment,

    loadApartments,
    createApartment,
  };
}
