import {
  useState,
} from "react";

import {
  api,
} from "../services/api";

function getErrorMessage(
  errorCode
) {
  const messages = {
    missing_password_fields:
      "Complete all password fields.",

    new_password_too_short:
      "The new password must contain at least 8 characters.",

    new_password_same_as_current:
      "The new password must be different from the current password.",

    current_password_incorrect:
      "The current password is incorrect.",

    user_not_found_or_inactive:
      "The user account is unavailable.",

    unauthorized:
      "Your session has expired. Sign in again.",

    not_found:
      "The password change service was not found.",

    password_change_failed:
      "The password could not be changed.",
  };

  return (
    messages[errorCode] ||
    "The password could not be changed."
  );
}

export default function useChangePassword() {
  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const submit =
    async ({
      currentPassword,
      newPassword,
    }) => {
      setSaving(true);
      setError("");
      setSuccess("");

      try {
        const result =
          await api(
            "/api/change-password",
            {
              method: "POST",

              body: JSON.stringify({
                current_password:
                  currentPassword,

                new_password:
                  newPassword,
              }),
            }
          );

        if (
          !result ||
          result.error ||
          result.ok === false
        ) {
          throw new Error(
            result?.error ||
            "password_change_failed"
          );
        }

        setSuccess(
          "Password changed successfully."
        );

        return true;
      } catch (submitError) {
        console.error(
          "CHANGE PASSWORD ERROR:",
          submitError
        );

        setError(
          getErrorMessage(
            submitError?.message
          )
        );

        return false;
      } finally {
        setSaving(false);
      }
    };

  const clearMessages =
    () => {
      setError("");
      setSuccess("");
    };

  return {
    saving,
    error,
    success,
    submit,
    clearMessages,
  };
}
