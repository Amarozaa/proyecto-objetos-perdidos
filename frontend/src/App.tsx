import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ListadoObjetosPerdidos from "./pages/ListadoObjetosPerdidos";
import FormularioPublicacion from "./pages/FormularioPublicacion";
import Navbar from "./pages/Navbar";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import Register from "./pages/Register"

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
        <Route path="/listado" element={<ListadoObjetosPerdidos />} />
        <Route path="/formulario" element={<FormularioPublicacion />} />
        <Route
          path="/publicacion/:id"
          element={
            <React.Suspense fallback={<div>Cargando...</div>}>
              <PublicacionDetalle />
            </React.Suspense>
          }
        />
        <Route path="/perfil/:id" element={<Perfil />} />
      </Routes>
    </>
  );
}

export default App;