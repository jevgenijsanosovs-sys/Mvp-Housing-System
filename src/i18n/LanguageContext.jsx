import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import translations from "../locales";

export const SUPPORTED_LANGUAGES = [
  "lv",
  "en",
  "ru",
];

export const DEFAULT_LANGUAGE =
  "lv";

export const LANGUAGE_STORAGE_KEY =
  "mvx_language";

export const LanguageContext =
  createContext(null);

export function normalizeLanguage(
  value
) {

  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const normalized =
    value
      .trim()
      .toLowerCase()
      .replace("_", "-")
      .split("-")[0];

  return SUPPORTED_LANGUAGES.includes(
    normalized
  )
    ? normalized
    : null;
}

function readStoredLanguage() {

  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    return normalizeLanguage(
      window.localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      )
    );
  } catch {
    return null;
  }
}

function detectBrowserLanguage() {

  if (
    typeof navigator ===
    "undefined"
  ) {
    return null;
  }

  const candidates = [
    ...(Array.isArray(
      navigator.languages
    )
      ? navigator.languages
      : []),
    navigator.language,
  ];

  for (
    const candidate of candidates
  ) {

    const normalized =
      normalizeLanguage(
        candidate
      );

    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function resolveInitialLanguage() {

  return (
    readStoredLanguage() ||
    detectBrowserLanguage() ||
    DEFAULT_LANGUAGE
  );
}

function getNestedValue(
  source,
  key
) {

  if (
    !source ||
    typeof key !== "string" ||
    !key.trim()
  ) {
    return undefined;
  }

  return key
    .split(".")
    .reduce(
      (
        current,
        segment
      ) => {

        if (
          current === null ||
          current === undefined ||
          typeof current !==
            "object"
        ) {
          return undefined;
        }

        return current[segment];
      },
      source
    );
}

function interpolate(
  value,
  variables
) {

  if (
    typeof value !== "string" ||
    !variables ||
    typeof variables !==
      "object"
  ) {
    return value;
  }

  return value.replace(
    /\{\{\s*([^{}\s]+)\s*\}\}/g,
    (
      match,
      variableName
    ) => {

      const replacement =
        variables[
          variableName
        ];

      return (
        replacement ===
          undefined ||
        replacement === null
      )
        ? match
        : String(
            replacement
          );
    }
  );
}

export function LanguageProvider({
  children,
}) {

  const [
    language,
    setLanguageState,
  ] = useState(
    resolveInitialLanguage
  );

  const setLanguage =
    useCallback(
      (
        nextLanguage
      ) => {

        const normalized =
          normalizeLanguage(
            nextLanguage
          );

        if (!normalized) {
          return false;
        }

        setLanguageState(
          normalized
        );

        try {
          window.localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            normalized
          );
        } catch {
          // Storage may be unavailable.
        }

        return true;
      },
      []
    );

  useEffect(
    () => {

      if (
        typeof document !==
        "undefined"
      ) {
        document.documentElement.lang =
          language;
      }

    },
    [language]
  );

  const t =
    useCallback(
      (
        key,
        variables
      ) => {

        const currentValue =
          getNestedValue(
            translations[
              language
            ],
            key
          );

        const fallbackValue =
          getNestedValue(
            translations[
              DEFAULT_LANGUAGE
            ],
            key
          );

        const value =
          currentValue ??
          fallbackValue;

        if (
          typeof value !==
          "string"
        ) {
          return key;
        }

        return interpolate(
          value,
          variables
        );
      },
      [language]
    );

  const value =
    useMemo(
      () => ({
        language,
        setLanguage,
        t,
        supportedLanguages:
          SUPPORTED_LANGUAGES,
      }),
      [
        language,
        setLanguage,
        t,
      ]
    );

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
}
