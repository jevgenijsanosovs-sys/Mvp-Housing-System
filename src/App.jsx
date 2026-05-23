import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import {
  layout,
  content,
} from "./styles/theme";

export default function App() {

  return (

    <div style={layout}>

      <Sidebar />

      <div style={content}>

        <Outlet />

      </div>

    </div>

  );

}