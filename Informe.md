# Proyecto - Aplicaciones Web Reactivas  

## Índice
- [Descripción](#descripción)
- [Estado Global](#estado-global)
- [Mapa de Rutas](#mapa-de-rutas)
- [Flujo de Autenticación](#flujo-de-autenticación)
- [Tests E2E](#tests-e2e)
- [Diseño y Estilo](#diseño-y-estilo)
- [Despliegue en Producción](#despliegue-en-producción)

## Descripción

Dentro de la comunidad en U-cursos surgen diversas publicaciones sobre objetos perdidos dentro de la facultad. Estos post terminan saturando los foros y dificultando la búsqueda de publicaciones relacionadas a temas académicos.

Para solucionar esta problemática se busca desarrollar una aplicación web que centralice la información sobre objetos perdidos y encontrados, facilitando la recuperación de pertenencias y mejorando la comunicación entre usuarios.

## Estado Global

Para la implementación de un manejo de estado global se utilizó la librería **Zustand** en donde se definieron dos stores para el proyecto: *postStore* y *userStore*. 

El store *postStore* se encarga de manejar el estado global de las publicaciones en la aplicación web. En este se definen las variables de estado ... y las funciones para actualizarlas y conectar con el servidor ...

El store *userStore* se encarga de manejar el estado global de los usuarios en la aplicación web. En este se definen las variables de estado ... y las funciones para actualizarlas y conectar con el servidor ...

## Mapa de Rutas


## Flujo de Autenticación

### Registro de Usuario (*POST /api/usuarios*)

En el backend hashea la contraseña con bcrypt, guarda el usuario en MongoDB y retorna datos del usuario (sin contraseña)

### Inicio de sesión (*POST /api/login { email, password }*)

Desde el frontend guarda CSRF y usuario en localStorage, y configura interceptor axios para incluir CSRF en requests. Desde el backend valida credenciales comparando hash generando un token CSRF único, crea y firma JWT y responde con token JWT (expira en 1 hora), token CSRF y datos del usuario.

### Requests autenticados (*Request a endpoint protegido*)

Desde el frontend interceptor axios añade automáticamente un token JWT (withCredentials: true) y el header X-CSRF-Token. Desde el backend se extrae JWT de la cookie y se verifica su firma. Luego compara CSRF del JWT con CSRF del header, si ambos coinciden añade userId al request, si no falla y retorna 401 Unauthorized.

### Cierre de sesión (*POST /api/login/logout*)

Desde el frontend se limpia localStorage y se redirige a /login. Desde el backend se elimina la cookie del JWT.

## Tests E2E

Descripción de los tests E2E (herramienta usada, flujos cubiertos).

## Diseño y Estilo

Librería de estilos utilizada y decisiones de diseño.

## Despliegue en Producción

URL de la aplicación desplegada en fullstack.dcc.uchile.cl:<puerto-asignado>.