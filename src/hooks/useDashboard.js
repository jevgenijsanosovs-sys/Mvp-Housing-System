import { useState } from "react";
import { api } from "../services/api";

export default function useDashboard() {

  const [dashboard, setDashboard] =
    useState(null);

  // =====================================
  // LOAD DASHBOARD
  // =====================================

  const loadDashboard = async () => {

    const d = await api(
      "/api/admin/dashboard"
    );

    setDashboard(d);
  };

  return {
    dashboard,
    loadDashboard,
  };
}