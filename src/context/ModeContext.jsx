import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ModeContext =
  createContext(null);

export function ModeProvider({
  children,
}) {

  const [mode, setMode] =
    useState(() => {

      return (
        localStorage.getItem(
          "app_mode"
        ) || "resident"
      );

    });

  useEffect(() => {

    localStorage.setItem(
      "app_mode",
      mode
    );

  }, [mode]);

  return (

    <ModeContext.Provider
      value={{
        mode,
        setMode,
      }}
    >

      {children}

    </ModeContext.Provider>

  );

}

export function useMode() {

  const context =
    useContext(ModeContext);

  if (!context) {

    throw new Error(
      "useMode must be used inside ModeProvider"
    );

  }

  return context;

}
