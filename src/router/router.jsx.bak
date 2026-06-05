import {
  createBrowserRouter,
} from "react-router-dom";

import App from "../App";

import DashboardPage from "../pages/DashboardPage";
import UsersPage from "../pages/UsersPage";
import ApartmentsPage from "../pages/ApartmentsPage";
import ResidentWaterPage from "../pages/ResidentWaterPage";
import AdminWaterPage from "../pages/AdminWaterPage";

export const router =
  createBrowserRouter([
    {
      path: "/",
      element: <App />,

      children: [

        {
          index: true,
          element: <DashboardPage />,
        },

        {
          path: "users",
          element: <UsersPage />,
        },

        {
          path: "apartments",
          element: <ApartmentsPage />,
        },

        {
          path: "water",
          element: <ResidentWaterPage />,
        },

        {
          path: "water-admin",
          element: <AdminWaterPage />,
        },

      ],
    },
  ]);