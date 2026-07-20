import {
  api,
} from "../services/api";

export async function getAnnouncements() {
  return await api(
    "/api/announcements"
  );
}

export async function getAnnouncement(
  announcementId
) {
  return await api(
    `/api/announcement?id=${encodeURIComponent(
      announcementId
    )}`
  );
}

export async function getAdminAnnouncements() {
  return await api(
    "/api/admin/announcements"
  );
}

export async function createAnnouncement(
  announcement
) {
  return await api(
    "/api/admin/announcements",
    {
      method: "POST",
      body: JSON.stringify(
        announcement
      ),
    }
  );
}

export async function updateAnnouncement(
  announcement
) {
  return await api(
    "/api/admin/update-announcement",
    {
      method: "POST",
      body: JSON.stringify(
        announcement
      ),
    }
  );
}

export async function publishAnnouncement(
  announcementId
) {
  return await api(
    "/api/admin/publish-announcement",
    {
      method: "POST",
      body: JSON.stringify({
        id: announcementId,
      }),
    }
  );
}

export async function archiveAnnouncement(
  announcementId
) {
  return await api(
    "/api/admin/archive-announcement",
    {
      method: "POST",
      body: JSON.stringify({
        id: announcementId,
      }),
    }
  );
}
