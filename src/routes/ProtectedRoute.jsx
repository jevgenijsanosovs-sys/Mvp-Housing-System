import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}) {
  const {
    token,
    me,
    loading,
  } = useAuth();

  const location =
    useLocation();

  if (loading) {
    return null;
  }

  if (
    !token ||
    !me?.user
  ) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  const mustChangePassword =
    Number(
      me.user
        .must_change_password
    ) === 1;

  if (
    mustChangePassword &&
    location.pathname !==
      "/settings"
  ) {
    return (
      <Navigate
        to="/settings"
        replace
      />
    );
  }

  return children;
}
