import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import ListadoObjetosPerdidos from "./pages/ListadoObjetosPerdidos";
import FormularioPublicacion from "./pages/FormularioPublicacion";
import Navbar from "./pages/Navbar";

const PublicacionDetalle = React.lazy(() => import("./pages/PublicacionDetalle"));

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/listado" element={<ListadoObjetosPerdidos />} />
        <Route path="/formulario" element={<FormularioPublicacion />} />

        <Route path="/publicacion/:id" element={
          <React.Suspense fallback={<div>Cargando...</div>}>
            <PublicacionDetalle />
          </React.Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;