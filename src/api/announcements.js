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
