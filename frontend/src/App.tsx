import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import ListadoObjetosPerdidos from "./pages/ListadoObjetosPerdidos";
import FormularioPublicacion from "./pages/FormularioPublicacion";
import { Usuario, Publicacion } from "./types/types";


const usuarioDemo: Usuario = {
  id: 1,
  nombre: "Amaro Zurita",
  email: "amaro@uc.cl",
  password: "1234",
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/listado" element={<ListadoObjetosPerdidos />} />
  <Route path="/formulario" element={<FormularioPublicacion usuario={usuarioDemo} onPublicacionCreada={() => {}} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
