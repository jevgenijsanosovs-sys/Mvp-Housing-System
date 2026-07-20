import {
  useMemo,
  useState,
} from "react";

import useAdminAnnouncements
  from "../hooks/useAdminAnnouncements";

const EMPTY_FORM = {
  id: null,
  title: "",
  content: "",
  priority: "normal",
  publish_from: "",
  publish_until: "",
};

function toDateTimeLocal(
  value
) {
  if (!value) {
    return "";
  }

  const text =
    String(value);

  return text
    .replace("Z", "")
    .replace(" ", "T")
    .slice(0, 16);
}

function toApiDateTime(
  value
) {
  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toISOString();
}

function formatDateTime(
  value
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function getStatusLabel(
  status
) {
  if (
    status === "published"
  ) {
    return "Published";
  }

  if (
    status === "archived"
  ) {
    return "Archived";
  }

  return "Draft";
}

function getStatusStyle(
  status
) {
  if (
    status === "published"
  ) {
    return {
      border:
        "1px solid rgba(21,128,61,.25)",
      background:
        "rgba(21,128,61,.07)",
      color: "#15803d",
    };
  }

  if (
    status === "archived"
  ) {
    return {
      border:
        "1px solid var(--border)",
      background:
        "var(--surface-soft)",
      color:
        "var(--text)",
    };
  }

  return {
    border:
      "1px solid rgba(180,83,83,.20)",
    background:
      "rgba(180,83,83,.06)",
    color: "#9f3f3f",
  };
}

export default function AdminAnnouncementsPage() {
  const {
    announcements,
    loading,
    saving,
    actionId,
    error,
    loadAnnouncements,
    saveAnnouncement,
    publishAnnouncement,
    archiveAnnouncement,
  } =
    useAdminAnnouncements();

  const [
    form,
    setForm,
  ] = useState(
    EMPTY_FORM
  );

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    notice,
    setNotice,
  ] = useState("");

  const isEditing =
    Boolean(form.id);

  const activeCount =
    useMemo(
      () =>
        announcements.filter(
          (item) =>
            item.status !==
              "archived"
        ).length,
      [announcements]
    );

  const resetForm =
    () => {
      setForm(
        EMPTY_FORM
      );
      setFormError("");
    };

  const changeField =
    (
      field,
      value
    ) => {
      setForm(
        (current) => ({
          ...current,
          [field]: value,
        })
      );
    };

  const editAnnouncement =
    (announcement) => {
      setForm({
        id: announcement.id,
        title:
          announcement.title ||
          "",
        content:
          announcement.content ||
          "",
        priority:
          announcement.priority ||
          "normal",
        publish_from:
          toDateTimeLocal(
            announcement.publish_from
          ),
        publish_until:
          toDateTimeLocal(
            announcement.publish_until
          ),
      });

      setFormError("");
      setNotice("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  const submit =
    async (
      publishImmediately
    ) => {
      setFormError("");
      setNotice("");

      const title =
        form.title.trim();

      const content =
        form.content.trim();

      if (!title) {
        setFormError(
          "Enter a title."
        );
        return;
      }

      if (!content) {
        setFormError(
          "Enter announcement text."
        );
        return;
      }

      if (
        form.publish_from &&
        form.publish_until &&
        new Date(
          form.publish_until
        ) <
          new Date(
            form.publish_from
          )
      ) {
        setFormError(
          "The end date cannot be earlier than the start date."
        );
        return;
      }

      try {
        await saveAnnouncement({
          id: form.id,
          title,
          content,
          priority:
            form.priority,
          publish_from:
            toApiDateTime(
              form.publish_from
            ),
          publish_until:
            toApiDateTime(
              form.publish_until
            ),
          publishImmediately,
        });

        setNotice(
          publishImmediately
            ? "Announcement published."
            : isEditing
              ? "Announcement updated."
              : "Draft saved."
        );

        resetForm();
      } catch {
        setFormError(
          "The announcement could not be saved. Check the message above."
        );
      }
    };

  const publish =
    async (
      announcement
    ) => {
      const approved =
        window.confirm(
          `Publish "${announcement.title}"?`
        );

      if (!approved) {
        return;
      }

      setNotice("");

      try {
        await publishAnnouncement(
          announcement.id
        );

        setNotice(
          "Announcement published."
        );
      } catch {
        // The hook exposes the backend error.
      }
    };

  const archive =
    async (
      announcement
    ) => {
      const approved =
        window.confirm(
          `Archive "${announcement.title}"? Residents will no longer see it.`
        );

      if (!approved) {
        return;
      }

      setNotice("");

      try {
        await archiveAnnouncement(
          announcement.id
        );

        if (
          form.id ===
            announcement.id
        ) {
          resetForm();
        }

        setNotice(
          "Announcement archived."
        );
      } catch {
        // The hook exposes the backend error.
      }
    };

  return (
    <div
      className="admin-announcements-page"
    >
      <style>
        {`
          .admin-announcements-page {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            overflow-x: hidden;
          }

          .announcement-form-grid {
            width: 100%;
            min-width: 0;
          }

          .announcement-form-grid > label {
            min-width: 0;
          }

          .announcement-form-grid input,
          .announcement-form-grid select {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          .announcement-form-grid input[type="datetime-local"] {
            display: block;
            -webkit-appearance: none;
            appearance: none;
          }

          @media (max-width: 700px) {
            .admin-announcements-page {
              padding-top: 56px;
            }

            .admin-announcements-page h1 {
              font-size: 30px !important;
              line-height: 1.15 !important;
              max-width: 280px;
            }

            .announcement-form-grid {
              grid-template-columns: minmax(0, 1fr) !important;
            }

            .announcement-actions {
              grid-template-columns: minmax(0, 1fr) !important;
            }

            .announcement-actions button {
              width: 100%;
            }

            .admin-announcement-panel {
              padding: 16px !important;
              border-radius: 12px !important;
            }

            .announcement-form-grid input[type="datetime-local"] {
              font-size: 16px !important;
            }
          }
        `}
      </style>
      <div
        style={{
          marginBottom: 22,
        }}
      >
        <h1
          style={{
            margin: 0,
            color:
              "var(--text-h)",
            lineHeight: 1.2,
            fontSize: 34,
          }}
        >
          Announcement Management
        </h1>

        <div
          style={{
            marginTop: 6,
            color:
              "var(--text)",
            fontSize: 13,
          }}
        >
          Create and publish notices
          for residents.
        </div>
      </div>

      {error && (
        <div
          role="alert"
          style={errorStyle}
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          style={noticeStyle}
        >
          {notice}
        </div>
      )}

      <section
        className="admin-announcement-panel"
        style={{
          ...panelStyle,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "flex-start",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color:
                  "var(--text-h)",
                fontSize: 18,
              }}
            >
              {isEditing
                ? "Edit Announcement"
                : "New Announcement"}
            </h2>

            <div
              style={{
                marginTop: 4,
                color:
                  "var(--text)",
                fontSize: 11,
              }}
            >
              Save as a draft or
              publish immediately.
            </div>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              style={
                secondaryButton
              }
            >
              Cancel editing
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          <label
            style={labelStyle}
          >
            Title
            <input
              type="text"
              value={form.title}
              maxLength={180}
              onChange={(event) =>
                changeField(
                  "title",
                  event.target.value
                )
              }
              style={inputStyle}
              placeholder="Announcement title"
            />
          </label>

          <label
            style={labelStyle}
          >
            Text
            <textarea
              value={form.content}
              onChange={(event) =>
                changeField(
                  "content",
                  event.target.value
                )
              }
              style={{
                ...inputStyle,
                minHeight: 160,
                resize: "vertical",
                lineHeight: 1.55,
              }}
              placeholder="Information for residents"
            />
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(210px,1fr))",
              gap: 12,
            }}
            className="announcement-form-grid"
          >
            <label
              style={labelStyle}
            >
              Priority
              <select
                value={
                  form.priority
                }
                onChange={(event) =>
                  changeField(
                    "priority",
                    event.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="normal">
                  Normal
                </option>
                <option value="important">
                  Important
                </option>
              </select>
            </label>

            <label
              style={labelStyle}
            >
              Visible from
              <input
                type="datetime-local"
                value={
                  form.publish_from
                }
                onChange={(event) =>
                  changeField(
                    "publish_from",
                    event.target.value
                  )
                }
                style={inputStyle}
              />
            </label>

            <label
              style={labelStyle}
            >
              Visible until
              <input
                type="datetime-local"
                value={
                  form.publish_until
                }
                onChange={(event) =>
                  changeField(
                    "publish_until",
                    event.target.value
                  )
                }
                style={inputStyle}
              />
            </label>
          </div>

          {formError && (
            <div
              role="alert"
              style={{
                color: "#9f3f3f",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {formError}
            </div>
          )}

          <div
            className="announcement-actions"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(150px,1fr))",
              gap: 10,
            }}
          >
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                submit(false)
              }
              style={
                secondaryButton
              }
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Save draft"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                submit(true)
              }
              style={
                primaryButton
              }
            >
              {saving
                ? "Saving..."
                : "Save and publish"}
            </button>
          </div>
        </div>
      </section>

      <section
        className="admin-announcement-panel"
        style={panelStyle}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color:
                  "var(--text-h)",
                fontSize: 18,
              }}
            >
              Announcements
            </h2>

            <div
              style={{
                marginTop: 4,
                color:
                  "var(--text)",
                fontSize: 11,
              }}
            >
              {activeCount} active or
              draft,{" "}
              {announcements.length}
              {" "}total
            </div>
          </div>

          <button
            type="button"
            onClick={
              loadAnnouncements
            }
            disabled={loading}
            style={
              secondaryButton
            }
          >
            {loading
              ? "Loading..."
              : "Refresh"}
          </button>
        </div>

        {loading ? (
          <EmptyState>
            Loading announcements...
          </EmptyState>
        ) : announcements.length ===
          0 ? (
          <EmptyState>
            No announcements created.
          </EmptyState>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 11,
            }}
          >
            {announcements.map(
              (announcement) => {
                const busy =
                  actionId ===
                    announcement.id;

                const archived =
                  announcement.status ===
                    "archived";

                return (
                  <article
                    key={
                      announcement.id
                    }
                    style={{
                      padding: 16,
                      border:
                        "1px solid var(--border)",
                      borderRadius: 11,
                      background:
                        archived
                          ? "var(--surface-soft)"
                          : "var(--surface)",
                      opacity:
                        archived
                          ? 0.78
                          : 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: 14,
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 0,
                          flex: "1 1 360px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            flexWrap: "wrap",
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              ...statusBadge,
                              ...getStatusStyle(
                                announcement.status
                              ),
                            }}
                          >
                            {getStatusLabel(
                              announcement.status
                            )}
                          </span>

                          <span
                            style={{
                              ...statusBadge,
                              border:
                                "1px solid var(--border)",
                              background:
                                "var(--surface-soft)",
                              color:
                                "var(--text)",
                            }}
                          >
                            {announcement.priority ===
                            "important"
                              ? "Important"
                              : "Normal"}
                          </span>
                        </div>

                        <h3
                          style={{
                            margin:
                              "0 0 7px",
                            color:
                              "var(--text-h)",
                            fontSize: 16,
                            lineHeight: 1.35,
                          }}
                        >
                          {announcement.title}
                        </h3>

                        <div
                          style={{
                            color:
                              "var(--text)",
                            fontSize: 12,
                            lineHeight: 1.55,
                            whiteSpace:
                              "pre-wrap",
                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {announcement.content}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 14,
                            flexWrap: "wrap",
                            marginTop: 11,
                            color:
                              "var(--text)",
                            fontSize: 10,
                          }}
                        >
                          <span>
                            Updated:{" "}
                            {formatDateTime(
                              announcement.updated_at
                            )}
                          </span>

                          <span>
                            From:{" "}
                            {formatDateTime(
                              announcement.publish_from
                            )}
                          </span>

                          <span>
                            Until:{" "}
                            {formatDateTime(
                              announcement.publish_until
                            )}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                          justifyContent:
                            "flex-end",
                        }}
                      >
                        {!archived && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              editAnnouncement(
                                announcement
                              )
                            }
                            style={
                              secondaryButton
                            }
                          >
                            Edit
                          </button>
                        )}

                        {!archived &&
                          announcement.status !==
                            "published" && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                publish(
                                  announcement
                                )
                              }
                              style={
                                primaryButton
                              }
                            >
                              {busy
                                ? "Working..."
                                : "Publish"}
                            </button>
                          )}

                        {!archived && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              archive(
                                announcement
                              )
                            }
                            style={
                              dangerButton
                            }
                          >
                            {busy
                              ? "Working..."
                              : "Archive"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({
  children,
}) {
  return (
    <div
      style={{
        padding: 22,
        border:
          "1px dashed var(--border)",
        borderRadius: 10,
        color:
          "var(--text)",
        fontSize: 12,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

const panelStyle = {
  padding: 18,
  border:
    "1px solid var(--border)",
  borderRadius: 14,
  background:
    "var(--surface)",
  boxShadow:
    "0 6px 20px rgba(15,23,42,.05)",
};

const labelStyle = {
  display: "grid",
  minWidth: 0,
  gap: 6,
  color:
    "var(--text-h)",
  fontSize: 11,
  fontWeight: 700,
};

const inputStyle = {
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  minHeight: 40,
  boxSizing: "border-box",
  padding: "9px 11px",
  border:
    "1px solid var(--border)",
  borderRadius: 9,
  outline: "none",
  background:
    "var(--surface)",
  color:
    "var(--text-h)",
  font: "inherit",
  fontSize: 13,
};

const baseButton = {
  minHeight: 36,
  padding: "8px 12px",
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
};

const primaryButton = {
  ...baseButton,
  border:
    "1px solid #1d4ed8",
  background: "#2563eb",
  color: "#ffffff",
};

const secondaryButton = {
  ...baseButton,
  border:
    "1px solid var(--border)",
  background:
    "var(--surface)",
  color:
    "var(--text-h)",
};

const dangerButton = {
  ...baseButton,
  border:
    "1px solid rgba(180,83,83,.28)",
  background:
    "rgba(180,83,83,.06)",
  color: "#9f3f3f",
};

const statusBadge = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 22,
  padding: "2px 7px",
  borderRadius: 999,
  fontSize: 9,
  fontWeight: 800,
  letterSpacing:
    "0.04em",
  textTransform:
    "uppercase",
};

const errorStyle = {
  marginBottom: 14,
  padding: 13,
  border:
    "1px solid rgba(180,83,83,.28)",
  borderRadius: 9,
  background:
    "rgba(180,83,83,.06)",
  color: "#9f3f3f",
  fontSize: 12,
};

const noticeStyle = {
  marginBottom: 14,
  padding: 13,
  border:
    "1px solid rgba(21,128,61,.24)",
  borderRadius: 9,
  background:
    "rgba(21,128,61,.06)",
  color: "#15803d",
  fontSize: 12,
};
