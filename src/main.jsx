import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import {
  RouterProvider,
} from "react-router-dom";

import { router } from "./router/router";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  ModeProvider,
} from "./context/ModeContext";

import {
  LanguageProvider,
} from "./i18n";

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <LanguageProvider>

      <AuthProvider>

        <ModeProvider>

          <RouterProvider
            router={router}
          />

        </ModeProvider>

      </AuthProvider>

    </LanguageProvider>

  </StrictMode>

);
