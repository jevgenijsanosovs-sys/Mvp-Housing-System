import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../services/api";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {

  const [token, setToken] =
    useState(
      localStorage.getItem("token")
    );

  const [me, setMe] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (!token) {
      setLoading(false);
      return;
    }

    api("/api/me")
      .then((d) => {

        if (!d?.user) {
          logout();
          return;
        }

        setMe(d);

      })
      .finally(() => {
        setLoading(false);
      });

  }, [token]);

  const login = async (
    email,
    password
  ) => {

    const res = await api(
      "/api/login",
      {
        method: "POST",

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!res?.token) {

      alert(
        res?.error ||
        "Login failed"
      );

      return false;
    }

    localStorage.setItem(
      "token",
      res.token
    );

    setToken(res.token);

    return true;
  };

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    setToken(null);

    setMe(null);
  };

  const value = {
    token,
    me,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  return useContext(AuthContext);

}