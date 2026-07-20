import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  archiveAnnouncement,
  createAnnouncement,
  getAdminAnnouncements,
  publishAnnouncement,
  updateAnnouncement,
} from "../api/announcements";

function getErrorMessage(
  error,
  fallback
) {
  return (
    error?.message ||
    fallback
  );
}

function ensureSuccessfulResult(
  result,
  fallback
) {
  if (result?.error) {
    throw new Error(
      result.error
    );
  }

  if (
    result?.ok === false
  ) {
    throw new Error(
      fallback
    );
  }

  return result;
}

export default function useAdminAnnouncements() {
  const [
    announcements,
    setAnnouncements,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    actionId,
    setActionId,
  ] = useState(null);

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
          await getAdminAnnouncements();

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
          "LOAD ADMIN ANNOUNCEMENTS ERROR:",
          loadError
        );

        setAnnouncements([]);

        setError(
          getErrorMessage(
            loadError,
            "Announcements could not be loaded."
          )
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

  const saveAnnouncement =
    async ({
      id,
      title,
      content,
      priority,
      publish_from,
      publish_until,
      publishImmediately,
    }) => {
      setSaving(true);
      setError("");

      try {
        const payload = {
          title,
          content,
          priority,
          publish_from:
            publish_from || null,
          publish_until:
            publish_until || null,
        };

        let result;

        if (id) {
          result =
            ensureSuccessfulResult(
              await updateAnnouncement({
                id,
                ...payload,
              }),
              "Announcement update failed."
            );

          if (
            publishImmediately
          ) {
            ensureSuccessfulResult(
              await publishAnnouncement(
                id
              ),
              "Announcement publish failed."
            );
          }
        } else {
          result =
            ensureSuccessfulResult(
              await createAnnouncement({
                ...payload,
                status:
                  publishImmediately
                    ? "published"
                    : "draft",
              }),
              "Announcement creation failed."
            );
        }

        await loadAnnouncements();

        return (
          result?.announcement ||
          null
        );
      } catch (saveError) {
        console.error(
          "SAVE ANNOUNCEMENT ERROR:",
          saveError
        );

        const message =
          getErrorMessage(
            saveError,
            "Announcement could not be saved."
          );

        setError(message);
        throw saveError;
      } finally {
        setSaving(false);
      }
    };

  const publish =
    async (
      announcementId
    ) => {
      setActionId(
        announcementId
      );
      setError("");

      try {
        ensureSuccessfulResult(
          await publishAnnouncement(
            announcementId
          ),
          "Announcement publish failed."
        );

        await loadAnnouncements();
      } catch (publishError) {
        console.error(
          "PUBLISH ANNOUNCEMENT ERROR:",
          publishError
        );

        const message =
          getErrorMessage(
            publishError,
            "Announcement could not be published."
          );

        setError(message);
        throw publishError;
      } finally {
        setActionId(null);
      }
    };

  const archive =
    async (
      announcementId
    ) => {
      setActionId(
        announcementId
      );
      setError("");

      try {
        ensureSuccessfulResult(
          await archiveAnnouncement(
            announcementId
          ),
          "Announcement archive failed."
        );

        await loadAnnouncements();
      } catch (archiveError) {
        console.error(
          "ARCHIVE ANNOUNCEMENT ERROR:",
          archiveError
        );

        const message =
          getErrorMessage(
            archiveError,
            "Announcement could not be archived."
          );

        setError(message);
        throw archiveError;
      } finally {
        setActionId(null);
      }
    };

  return {
    announcements,
    loading,
    saving,
    actionId,
    error,
    loadAnnouncements,
    saveAnnouncement,
    publishAnnouncement:
      publish,
    archiveAnnouncement:
      archive,
  };
}
