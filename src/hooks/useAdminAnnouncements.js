import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  archiveAnnouncement,
  createAnnouncement,
  getAdminAnnouncements,
  getAnnouncementTargetOptions,
  publishAnnouncement,
  updateAnnouncement,
} from "../api/announcements";

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function ensureSuccessfulResult(result, fallback) {
  if (result?.error) {
    throw new Error(result.error);
  }

  if (result?.ok === false) {
    throw new Error(fallback);
  }

  return result;
}

export default function useAdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [targetOptions, setTargetOptions] = useState({
    sections: [],
    apartments: [],
    roles: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAdminAnnouncements();

      if (result?.error) {
        throw new Error(result.error);
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

  const loadTargetOptions = useCallback(async () => {
    setOptionsLoading(true);

    try {
      const result =
        ensureSuccessfulResult(
          await getAnnouncementTargetOptions(),
          "Recipient options could not be loaded."
        );

      setTargetOptions({
        sections: Array.isArray(result?.sections)
          ? result.sections
          : [],
        apartments: Array.isArray(result?.apartments)
          ? result.apartments
          : [],
        roles: Array.isArray(result?.roles)
          ? result.roles
          : [],
        users: Array.isArray(result?.users)
          ? result.users
          : [],
      });
    } catch (optionsError) {
      console.error(
        "LOAD ANNOUNCEMENT TARGET OPTIONS ERROR:",
        optionsError
      );

      setTargetOptions({
        sections: [],
        apartments: [],
        roles: [],
        users: [],
      });

      setError(
        getErrorMessage(
          optionsError,
          "Recipient options could not be loaded."
        )
      );
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
    loadTargetOptions();
  }, [
    loadAnnouncements,
    loadTargetOptions,
  ]);

  const saveAnnouncement = async ({
    id,
    title,
    content,
    priority,
    publish_from,
    publish_until,
    publishImmediately,
    targets,
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
        targets:
          Array.isArray(targets)
            ? targets
            : [],
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

        if (publishImmediately) {
          result =
            ensureSuccessfulResult(
              await publishAnnouncement(id),
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

      return {
        announcement:
          result?.announcement ||
          null,
        pushDelivery:
          result?.push_delivery ||
          null,
      };
    } catch (saveError) {
      console.error(
        "SAVE ANNOUNCEMENT ERROR:",
        saveError
      );

      setError(
        getErrorMessage(
          saveError,
          "Announcement could not be saved."
        )
      );

      throw saveError;
    } finally {
      setSaving(false);
    }
  };

  const publish = async (announcementId) => {
    setActionId(announcementId);
    setError("");

    try {
      const result =
        ensureSuccessfulResult(
          await publishAnnouncement(
            announcementId
          ),
          "Announcement publish failed."
        );

      await loadAnnouncements();

      return {
        announcement:
          result?.announcement ||
          null,
        pushDelivery:
          result?.push_delivery ||
          null,
      };
    } catch (publishError) {
      console.error(
        "PUBLISH ANNOUNCEMENT ERROR:",
        publishError
      );

      setError(
        getErrorMessage(
          publishError,
          "Announcement could not be published."
        )
      );

      throw publishError;
    } finally {
      setActionId(null);
    }
  };

  const archive = async (announcementId) => {
    setActionId(announcementId);
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

      setError(
        getErrorMessage(
          archiveError,
          "Announcement could not be archived."
        )
      );

      throw archiveError;
    } finally {
      setActionId(null);
    }
  };

  return {
    announcements,
    targetOptions,
    loading,
    optionsLoading,
    saving,
    actionId,
    error,
    loadAnnouncements,
    loadTargetOptions,
    saveAnnouncement,
    publishAnnouncement: publish,
    archiveAnnouncement: archive,
  };
}
