import {
  createBrowserRouter,
} from "react-router-dom";

import App from "../App";

import DashboardScreen from "../screens/DashboardScreen";
import UsersScreen from "../screens/UsersScreen";
import ApartmentsScreen from "../screens/ApartmentsScreen";
import ResidentWaterScreen from "../screens/ResidentWaterScreen";
import AdminWaterScreen from "../screens/AdminWaterScreen";

export const router =
  createBrowserRouter([
    {
      path: "/",
      element: <App />,

      children: [

        {
          index: true,
          element: (
            <DashboardScreen />
          ),
        },

        {
          path: "users",
          element: (
            <UsersScreen />
          ),
        },

        {
          path: "apartments",
          element: (
            <ApartmentsScreen />
          ),
        },

        {
          path: "water",
          element: (
            <ResidentWaterScreen />
          ),
        },

        {
          path: "water-admin",
          element: (
            <AdminWaterScreen />
          ),
        },

      ],
    },
  ]);