import {
  useState,
} from "react";

import {
  api,
} from "../services/api";

const EMPTY_APARTMENT = {
  number: "",
  section: "",
  floor: "",
  room_count: 1,
  resident_count: 0,
  living_area: "",
  non_living_area: "",
  heated_area: "",
  alternative_heating_area: "",
  land_tax_area: "",
  alternative_heating: false,
  hot_water_riser_count: 0,
  level_count: 1,
  notes: "",
};

export default function useApartments() {
  const [apartments, setApartments] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showCreateApartment, setShowCreateApartment] =
    useState(false);

  const [newApartment, setNewApartment] =
    useState(EMPTY_APARTMENT);

  const loadApartments = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api(
        "/api/apartments/full"
      );

      if (result?.error) {
        throw new Error(result.error);
      }

      setApartments(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (loadError) {
      console.error(
        "LOAD APARTMENTS ERROR:",
        loadError
      );

      setApartments([]);
      setError(
        loadError?.message ||
        "Apartments could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  const createApartment = async () => {
    setError("");

    try {
      const result = await api(
        "/api/admin/create-apartment",
        {
          method: "POST",
          body: JSON.stringify(
            newApartment
          ),
        }
      );

      if (
        result?.error ||
        result?.ok === false
      ) {
        throw new Error(
          result?.error ||
          "Create failed"
        );
      }

      setShowCreateApartment(false);
      setNewApartment(
        EMPTY_APARTMENT
      );

      await loadApartments();

      return result;
    } catch (createError) {
      console.error(
        "CREATE APARTMENT ERROR:",
        createError
      );

      setError(
        createError?.message ||
        "Apartment could not be created."
      );

      throw createError;
    }
  };

  return {
    apartments,
    setApartments,
    loading,
    error,
    showCreateApartment,
    setShowCreateApartment,
    newApartment,
    setNewApartment,
    loadApartments,
    createApartment,
  };
}
