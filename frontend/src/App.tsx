import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ListadoObjetosPerdidos from "./pages/ListadoObjetosPerdidos";
import FormularioPublicacion from "./pages/FormularioPublicacion";
import Navbar from "./pages/Navbar";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditarPerfil from "./pages/EditarPerfil";
import EditarPublicacion from "./pages/EditarPublicacion";
import { ProtectedRoute } from "./components/ProtectedRoute";

const PublicacionDetalle = React.lazy(() => import("./pages/PublicacionDetalle"));

function App() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}

function MainRoutes() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
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
          path="/publicacion/:id"
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<div>Cargando...</div>}>
                <PublicacionDetalle />
              </React.Suspense>
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
        <Route 
          path="/perfil/:id/editar" 
          element={
            <ProtectedRoute>
              <EditarPerfil />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/publicacion/:id/editar" 
          element={
            <ProtectedRoute>
              <EditarPublicacion />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;