import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import Dashboard from "./features/dashboard/Dashboard";
import Incidentes from "./features/incidentes/Incidentes";
import Usuarios from "./features/usuarios/usuarios";
import DashboardHome from "./features/dashboard/DashboardHome";
import { Require } from "./components/Autorize";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="incidentes" element={<Incidentes />} />
          <Route
            path="usuarios"
            element={
              <Require rol="admin">
                <Usuarios />
              </Require>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
