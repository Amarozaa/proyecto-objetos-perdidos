import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import ListadoObjetosPerdidos from "./pages/ListadoObjetosPerdidos";
import FormularioPublicacion from "./pages/FormularioPublicacion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/listado" element={<ListadoObjetosPerdidos />} />
        <Route path="/formulario" element={<FormularioPublicacion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
