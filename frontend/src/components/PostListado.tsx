import type { Publicacion } from "../types/types";

const PostListado = (props: Publicacion) => {
  return (
    <div>
      <h1>{props.titulo}</h1>
      <p> Fecha de creación: {props.fecha_creacion}</p>
      <p> Descripción: {props.descripcion}</p>
    </div>
  );
};

export default PostListado;
