import {
  useMemo,
  useState,
} from "react";

import useChangePassword
  from "../hooks/useChangePassword";

import {
  useTranslation,
} from "../i18n";

const TEXT = {
  en: {
    title: "Settings",
    subtitle:
      "Manage your personal account settings.",
    security: "Security",
    password: "Password",
    hint:
      "Use at least 8 characters. The new password must be different from the current password.",
    current:
      "Current password",
    next:
      "New password",
    confirm:
      "Confirm new password",
    change:
      "Change password",
    saving:
      "Changing password...",
    required:
      "Complete all password fields.",
    mismatch:
      "The new password confirmation does not match.",
    short:
      "The new password must contain at least 8 characters.",
    same:
      "The new password must be different from the current password.",
    success:
      "Password changed successfully.",
    incorrect:
      "The current password is incorrect.",
    failed:
      "The password could not be changed.",
  },

  lv: {
    title: "Iestatījumi",
    subtitle:
      "Pārvaldiet sava konta personīgos iestatījumus.",
    security: "Drošība",
    password: "Parole",
    hint:
      "Izmantojiet vismaz 8 rakstzīmes. Jaunajai parolei jāatšķiras no pašreizējās.",
    current:
      "Pašreizējā parole",
    next:
      "Jaunā parole",
    confirm:
      "Atkārtojiet jauno paroli",
    change:
      "Mainīt paroli",
    saving:
      "Parole tiek mainīta...",
    required:
      "Aizpildiet visus paroles laukus.",
    mismatch:
      "Jaunās paroles atkārtojums nesakrīt.",
    short:
      "Jaunajai parolei jābūt vismaz 8 rakstzīmes garai.",
    same:
      "Jaunajai parolei jāatšķiras no pašreizējās.",
    success:
      "Parole ir veiksmīgi nomainīta.",
    incorrect:
      "Pašreizējā parole nav pareiza.",
    failed:
      "Paroli neizdevās nomainīt.",
  },

  ru: {
    title: "Настройки",
    subtitle:
      "Управление персональными настройками учетной записи.",
    security: "Безопасность",
    password: "Пароль",
    hint:
      "Используйте не менее 8 символов. Новый пароль должен отличаться от текущего.",
    current:
      "Текущий пароль",
    next:
      "Новый пароль",
    confirm:
      "Повторите новый пароль",
    change:
      "Изменить пароль",
    saving:
      "Изменение пароля...",
    required:
      "Заполните все поля пароля.",
    mismatch:
      "Подтверждение нового пароля не совпадает.",
    short:
      "Новый пароль должен содержать не менее 8 символов.",
    same:
      "Новый пароль должен отличаться от текущего.",
    success:
      "Пароль успешно изменен.",
    incorrect:
      "Текущий пароль указан неверно.",
    failed:
      "Не удалось изменить пароль.",
  },
};

function mapMessage(
  message,
  text
) {
  const messages = {
    "Complete all password fields.":
      text.required,

    "The new password must contain at least 8 characters.":
      text.short,

    "The new password must be different from the current password.":
      text.same,

    "The current password is incorrect.":
      text.incorrect,

    "Password changed successfully.":
      text.success,
  };

  return (
    messages[message] ||
    text.failed
  );
}

export default function SettingsPage() {
  const {
    language,
  } = useTranslation();

  const text =
    useMemo(
      () =>
        TEXT[language] ||
        TEXT.en,
      [language]
    );

  const {
    saving,
    error,
    success,
    submit,
    clearMessages,
  } =
    useChangePassword();

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    validationError,
    setValidationError,
  ] = useState("");

  const changeField =
    (setter) =>
      (event) => {
        setter(
          event.target.value
        );

        setValidationError("");
        clearMessages();
      };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setValidationError("");

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        setValidationError(
          text.required
        );
        return;
      }

      if (
        newPassword.length < 8
      ) {
        setValidationError(
          text.short
        );
        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setValidationError(
          text.mismatch
        );
        return;
      }

      if (
        currentPassword ===
        newPassword
      ) {
        setValidationError(
          text.same
        );
        return;
      }

      const changed =
        await submit({
          currentPassword,
          newPassword,
        });

      if (changed) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    };

  const visibleError =
    validationError ||
    (
      error
        ? mapMessage(
            error,
            text
          )
        : ""
    );

  const visibleSuccess =
    success
      ? mapMessage(
          success,
          text
        )
      : "";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
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
            fontSize: 34,
            lineHeight: 1.2,
          }}
        >
          {text.title}
        </h1>

        <div
          style={{
            marginTop: 6,
            color:
              "var(--text)",
            fontSize: 13,
          }}
        >
          {text.subtitle}
        </div>
      </div>

      <section
        style={{
          padding: 20,
          border:
            "1px solid var(--border)",
          borderRadius: 14,
          background:
            "var(--surface)",
          boxShadow:
            "0 6px 20px rgba(15,23,42,.05)",
        }}
      >
        <div
          style={{
            marginBottom: 18,
          }}
        >
          <div
            style={{
              color:
                "var(--text)",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing:
                "0.06em",
              textTransform:
                "uppercase",
            }}
          >
            {text.security}
          </div>

          <h2
            style={{
              margin:
                "5px 0 0",
              color:
                "var(--text-h)",
              fontSize: 19,
            }}
          >
            {text.password}
          </h2>

          <div
            style={{
              marginTop: 6,
              color:
                "var(--text)",
              fontSize: 11,
              lineHeight: 1.55,
            }}
          >
            {text.hint}
          </div>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          <PasswordField
            label={
              text.current
            }
            value={
              currentPassword
            }
            onChange={changeField(
              setCurrentPassword
            )}
            autoComplete="current-password"
          />

          <PasswordField
            label={
              text.next
            }
            value={
              newPassword
            }
            onChange={changeField(
              setNewPassword
            )}
            autoComplete="new-password"
          />

          <PasswordField
            label={
              text.confirm
            }
            value={
              confirmPassword
            }
            onChange={changeField(
              setConfirmPassword
            )}
            autoComplete="new-password"
          />

          {visibleError && (
            <div
              role="alert"
              style={errorStyle}
            >
              {visibleError}
            </div>
          )}

          {visibleSuccess && (
            <div
              role="status"
              style={successStyle}
            >
              {visibleSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              minHeight: 42,
              padding:
                "9px 14px",
              border:
                "1px solid #1d4ed8",
              borderRadius: 9,
              background:
                saving
                  ? "#93a4c7"
                  : "#2563eb",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 800,
              cursor:
                saving
                  ? "default"
                  : "pointer",
            }}
          >
            {saving
              ? text.saving
              : text.change}
          </button>
        </form>
      </section>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: 6,
        color:
          "var(--text-h)",
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {label}

      <input
        type="password"
        value={value}
        onChange={onChange}
        autoComplete={
          autoComplete
        }
        style={{
          width: "100%",
          minWidth: 0,
          minHeight: 42,
          boxSizing:
            "border-box",
          padding:
            "9px 11px",
          border:
            "1px solid var(--border)",
          borderRadius: 9,
          outline: "none",
          background:
            "var(--surface)",
          color:
            "var(--text-h)",
          font: "inherit",
          fontSize: 14,
        }}
      />
    </label>
  );
}

const errorStyle = {
  padding: 12,
  border:
    "1px solid rgba(180,83,83,.28)",
  borderRadius: 9,
  background:
    "rgba(180,83,83,.06)",
  color: "#9f3f3f",
  fontSize: 12,
};

const successStyle = {
  padding: 12,
  border:
    "1px solid rgba(21,128,61,.24)",
  borderRadius: 9,
  background:
    "rgba(21,128,61,.06)",
  color: "#15803d",
  fontSize: 12,
};
