import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import ListadoObjetosPerdidos from "./pages/ListadoObjetosPerdidos";
import FormularioPublicacion from "./pages/FormularioPublicacion";
import Navbar from "./pages/Navbar";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}

function MainRoutes() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("user");

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    (!isAuthenticated &&
      location.pathname !== "/login" &&
      location.pathname !== "/register");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/publicaciones"
          element={
            <ProtectedRoute>
              <ListadoObjetosPerdidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/formulario"
          element={
            <ProtectedRoute>
              <FormularioPublicacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/:id"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
