import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import {
  layout,
  content,
} from "./styles/theme";

export default function App() {

  const [isMobile, setIsMobile] =
    useState(window.innerWidth < 768);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  useEffect(() => {

    const onResize = () => {

      setIsMobile(
        window.innerWidth < 768
      );

      if (
        window.innerWidth >= 768
      ) {
        setSidebarOpen(false);
      }

    };

    window.addEventListener(
      "resize",
      onResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        onResize
      );

  }, []);

  return (

    <div style={layout}>

      {isMobile && (

        <>

          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            style={{
              position: "fixed",
              top: 12,
              left: 12,
              zIndex: 2000,

              width: 44,
              height: 44,

              border: "none",
              borderRadius: 10,

              fontSize: 22,
              cursor: "pointer",

              background: "#2563eb",
              color: "white",
            }}
          >
            ☰
          </button>

          {sidebarOpen && (

            <div
              onClick={() =>
                setSidebarOpen(false)
              }
              style={{
                position: "fixed",
                inset: 0,

                background:
                  "rgba(0,0,0,0.35)",

                zIndex: 1500,
              }}
            />

          )}

        </>

      )}

      <Sidebar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={
          setSidebarOpen
        }
      />

      <div
        style={{
          ...content,

          width: "100%",

          paddingTop:
            isMobile ? 70 : 30,
        }}
      >

        <Outlet />

      </div>

    </div>

  );

}