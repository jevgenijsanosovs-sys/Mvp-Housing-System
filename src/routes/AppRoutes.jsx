import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardScreen from "../screens/DashboardScreen";
import UsersScreen from "../screens/UsersScreen";
import ApartmentsScreen from "../screens/ApartmentsScreen";
import ResidentWaterScreen from "../screens/ResidentWaterScreen";
import AdminWaterScreen from "../screens/AdminWaterScreen";

export default function AppRoutes(props) {

  return (

    <Routes>

      <Route
        path="/"
        element={
          <Navigate to="/dashboard" />
        }
      />

      <Route
        path="/dashboard"
        element={
          <DashboardScreen
            mode={props.mode}
            dashboard={props.dashboard}
          />
        }
      />

      <Route
        path="/users"
        element={
          <UsersScreen
            {...props.usersProps}
          />
        }
      />

      <Route
        path="/apartments"
        element={
          <ApartmentsScreen
            {...props.apartmentsProps}
          />
        }
      />

      <Route
        path="/water"
        element={
          <ResidentWaterScreen
            waterMeters={
              props.waterMeters
            }
            submitReading={
              props.submitReading
            }
          />
        }
      />

      <Route
        path="/water-admin"
        element={
          <AdminWaterScreen
            adminWater={
              props.adminWater
            }
          />
        }
      />

    </Routes>
  );
}