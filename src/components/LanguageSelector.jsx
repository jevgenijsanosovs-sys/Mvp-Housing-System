import useTranslation from "../i18n/useTranslation";

const LANGUAGE_OPTIONS = [
  {
    code: "lv",
    shortLabel: "LV",
  },
  {
    code: "en",
    shortLabel: "EN",
  },
  {
    code: "ru",
    shortLabel: "RU",
  },
];

export default function LanguageSelector({
  variant = "sidebar",
  className,
  style,
}) {

  const {
    language,
    setLanguage,
    t,
  } = useTranslation();

  const compact =
    variant === "compact";

  return (
    <label
      className={className}
      style={{
        display:
          compact
            ? "inline-flex"
            : "grid",
        gap:
          compact
            ? 0
            : 6,
        minWidth:
          compact
            ? 62
            : 0,
        ...style,
      }}
    >

      {!compact && (
        <span
          style={{
            color: "inherit",
            fontSize: 11,
            fontWeight: 700,
            opacity: 0.8,
          }}
        >
          {t(
            "common.language.label"
          )}
        </span>
      )}

      <select
        value={language}
        aria-label={t(
          "common.language.label"
        )}
        onChange={(event) =>
          setLanguage(
            event.target.value
          )
        }
        style={{
          width: "100%",
          minHeight:
            compact
              ? 34
              : 38,
          padding:
            compact
              ? "6px 8px"
              : "8px 10px",
          border:
            "1px solid currentColor",
          borderRadius: 9,
          background:
            "var(--surface, #ffffff)",
          color:
            "var(--text-h, #111827)",
          fontSize:
            compact
              ? 11
              : 13,
          fontWeight: 700,
          cursor: "pointer",
          boxSizing:
            "border-box",
        }}
      >

        {LANGUAGE_OPTIONS.map(
          (
            option
          ) => (

            <option
              key={
                option.code
              }
              value={
                option.code
              }
            >
              {compact
                ? option.shortLabel
                : t(
                    `common.language.${option.code}`
                  )}
            </option>

          )
        )}

      </select>

    </label>
  );
}
