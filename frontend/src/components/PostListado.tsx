import type { Publicacion } from "../types/types";

const PostListado = (props: Publicacion) => {
  return (
    <div>
      <h1>{props.titulo}</h1>
      {props.imagen_url && <img src={props.imagen_url} alt={props.titulo} />}
      <p> Fecha de creación: {props.fecha_creacion}</p>
      <p> Descripción: {props.descripcion}</p>
    </div>
  );
};

export default PostListado;
