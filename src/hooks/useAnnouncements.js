import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAnnouncements,
} from "../api/announcements";

export default function useAnnouncements() {
  const [
    announcements,
    setAnnouncements,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const loadAnnouncements =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const result =
          await getAnnouncements();

        if (result?.error) {
          throw new Error(
            result.error
          );
        }

        setAnnouncements(
          Array.isArray(result)
            ? result
            : []
        );
      } catch (loadError) {
        console.error(
          "LOAD ANNOUNCEMENTS ERROR:",
          loadError
        );

        setAnnouncements([]);

        setError(
          "Announcements could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [
    loadAnnouncements,
  ]);

  return {
    announcements,
    loading,
    error,
    refreshAnnouncements:
      loadAnnouncements,
  };
}
