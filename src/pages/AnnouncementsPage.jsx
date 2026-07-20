import {
  useState,
} from "react";

import useAnnouncements
  from "../hooks/useAnnouncements";

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function getAnnouncementDate(
  announcement
) {
  return (
    announcement.published_at ||
    announcement.publish_from ||
    announcement.created_at
  );
}

function getPreview(content) {
  const normalized =
    String(
      content || ""
    )
      .replace(/\s+/g, " ")
      .trim();

  if (
    normalized.length <= 190
  ) {
    return normalized;
  }

  return `${normalized.slice(
    0,
    187
  )}...`;
}

function AnnouncementCard({
  announcement,
  expanded,
  onToggle,
}) {
  const isImportant =
    announcement.priority ===
      "important";

  const fullContent =
    String(
      announcement.content || ""
    );

  const visibleContent =
    expanded
      ? fullContent
      : getPreview(
          fullContent
        );

  return (
    <article
      style={{
        background: "#ffffff",
        border:
          "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 20,
        boxShadow:
          "0 1px 3px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform:
              "uppercase",
            color: isImportant
              ? "#991b1b"
              : "#475569",
          }}
        >
          <span aria-hidden="true">
            {isImportant
              ? "!"
              : "i"}
          </span>

          {isImportant
            ? "Important"
            : "Information"}
        </div>

        <time
          dateTime={
            getAnnouncementDate(
              announcement
            ) || undefined
          }
          style={{
            color: "#64748b",
            fontSize: 13,
          }}
        >
          {formatDate(
            getAnnouncementDate(
              announcement
            )
          )}
        </time>
      </div>

      <h2
        style={{
          margin:
            "0 0 10px 0",
          color: "#0f172a",
          fontSize: 20,
          lineHeight: 1.3,
        }}
      >
        {announcement.title}
      </h2>

      <div
        style={{
          color: "#334155",
          fontSize: 15,
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
          overflowWrap:
            "anywhere",
        }}
      >
        {visibleContent}
      </div>

      {fullContent.trim().length >
        190 && (
        <button
          type="button"
          onClick={onToggle}
          style={{
            marginTop: 16,
            padding: 0,
            border: "none",
            background:
              "transparent",
            color: "#2563eb",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {expanded
            ? "Show less"
            : "Read more"}
        </button>
      )}
    </article>
  );
}

export default function AnnouncementsPage() {
  const {
    announcements,
    loading,
    error,
    refreshAnnouncements,
  } =
    useAnnouncements();

  const [
    expandedIds,
    setExpandedIds,
  ] = useState(
    () => new Set()
  );

  const toggleAnnouncement =
    (announcementId) => {
      setExpandedIds(
        (current) => {
          const next =
            new Set(current);

          if (
            next.has(
              announcementId
            )
          ) {
            next.delete(
              announcementId
            );
          } else {
            next.add(
              announcementId
            );
          }

          return next;
        }
      );
    };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems:
            "flex-start",
          justifyContent:
            "space-between",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin:
                "0 0 8px 0",
              color: "#0f172a",
              fontSize: 30,
              lineHeight: 1.2,
            }}
          >
            Announcements
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            Current information from
            DzĪKS IRLAVA 20.
          </p>
        </div>

        <button
          type="button"
          onClick={
            refreshAnnouncements
          }
          disabled={loading}
          style={{
            minHeight: 40,
            padding:
              "9px 14px",
            border:
              "1px solid #cbd5e1",
            borderRadius: 10,
            background:
              "#ffffff",
            color: "#334155",
            fontWeight: 600,
            cursor: loading
              ? "default"
              : "pointer",
            opacity: loading
              ? 0.65
              : 1,
          }}
        >
          {loading
            ? "Loading..."
            : "Refresh"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginBottom: 18,
            padding: 16,
            border:
              "1px solid #fecaca",
            borderRadius: 12,
            background:
              "#fef2f2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        announcements.length ===
          0 && (
          <div
            style={{
              padding: 24,
              border:
                "1px solid #e5e7eb",
              borderRadius: 14,
              background:
                "#ffffff",
              color: "#64748b",
              textAlign: "center",
            }}
          >
            There are no current
            announcements.
          </div>
        )}

      <div
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        {announcements.map(
          (announcement) => (
            <AnnouncementCard
              key={
                announcement.id
              }
              announcement={
                announcement
              }
              expanded={
                expandedIds.has(
                  announcement.id
                )
              }
              onToggle={() =>
                toggleAnnouncement(
                  announcement.id
                )
              }
            />
          )
        )}
      </div>
    </div>
  );
}
