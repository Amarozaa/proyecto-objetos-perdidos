# Proyecto - Aplicaciones Web Reactivas
## Integrantes
- Amaro Zurita A.
- Marco Martínez S.
- Pedro Escobar L.
- Rocio Farías
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

### postStore
El store *postStore* se encarga de manejar el estado global de las publicaciones en la aplicación web. Define las siguientes variables de estado:
- `posts`: Array de todas las publicaciones obtenidas del servidor
- `postsUsuario`: Array de publicaciones del usuario actual
- `post`: Publicación individual seleccionada
- `filter`: Filtro actual ("Todos", "Perdido", "Encontrado")

Y tiene las siguientes acciones:
- `obtenerTodas()`: Obtiene todas las publicaciones del servidor
- `obtenerTodasUsuario(user_id)`: Obtiene publicaciones de un usuario específico
- `crear()`: Crea una nueva publicación
- `actualizar()`: Actualiza una publicación existente
- `eliminar()`: Elimina una publicación
- `filtrar()`: Filtra por tipo, categoría, estado o lugar
- `buscar()`: Busca publicaciones por query

### userStore
El store *userStore* se encarga de manejar el estado global de los usuarios en la aplicación web. Define las siguientes variables de estado:
- `users`: Array de todos los usuarios
- `actualUser`: Usuario actualmente autenticado
- `selectedUser`: Usuario cuyo perfil se está visualizando

Y proporciona las siguientes acciones:
- `obtenerTodos()`: Obtiene todos los usuarios
- `obtenerUserPorId(id)`: Obtiene un usuario específico por ID
- `crear()`: Registra un nuevo usuario
- `actualizar()`: Actualiza datos del usuario
- `login()`: Establece el usuario autenticado
- `logout()`: Limpia el estado de autenticación

## Mapa de Rutas

Se utiliza React Router para la navegación, donde tenemos las siguientes rutas:

| Ruta | Componente | Acceso | Descripción |
|------|-----------|--------|-------------|
| `/` | Redirección | Público | Redirige automáticamente a `/login` |
| `/login` | Login | Público | Formulario para iniciar sesión y página principal de autenticación |
| `/register` | Register | Público | Formulario para registrarse |
| `/publicaciones` | ListadoObjetosPerdidos | Protegido | Listado de todas las publicaciones activas (sin resueltas) |
| `/formulario` | FormularioPublicacion | Protegido | Formulario para crear una nueva publicación |
| `/perfil/:id` | Perfil | Protegido | Perfil de usuario con todas sus publicaciones (incluidas las resueltas) |

**Rutas protegidas**: Las rutas `/publicaciones`, `/formulario` y `/perfil/:id` están protegidas mediante el componente `ProtectedRoute` que verifica si el usuario está autenticado. Si no lo está, redirige a `/login`.

**Manejo de rutas no encontradas**: Cualquier ruta que no exista en la aplicación muestra una página 404 personalizada. Si el usuario no está autenticado, se muestra solo la página 404. Si está autenticado, se muestra la página 404 junto con la navbar para mantener la navegación accesible.

**Comportamiento de la Navbar**: La barra de navegación se oculta en las rutas `/login` y `/register` para tener una interfaz limpia.


## Flujo de Autenticación

### Registro de Usuario

Cuando un nuevo usuario se registra, proporciona sus datos personales incluyendo una contraseña. El servidor hashea esta contraseña usando bcrypt para protegerla, luego almacena el usuario en la base de datos sin guardar nunca la contraseña en texto plano. Finalmente, retorna los datos del usuario registrado sin incluir la contraseña en la respuesta.

### Inicio de Sesión

El usuario ingresa su email y contraseña en el formulario de login. El servidor compara estas credenciales con las almacenadas (comparando la contraseña ingresada con el hash guardado). Si coinciden, genera un token CSRF único para proteger contra ataques cross-site, crea un JWT (token de autenticación) con validez de 1 hora, y responde al cliente con ambos tokens. El frontend almacena esta información en localStorage para recordar que el usuario está autenticado en futuras visitas.

### Requests Autenticados

Una vez autenticado, cada vez que el usuario realiza una acción que requiere permisos (crear publicación, editar perfil, etc.), el navegador incluye automáticamente el JWT en las cookies y el CSRF token en los headers. El backend verifica que ambos tokens sean válidos y que correspondan entre sí. Si la verificación es exitosa, procesa la solicitud. Si algún token es inválido o no coinciden, rechaza la solicitud con un error 401 Unauthorized.

### Cierre de Sesión

Cuando el usuario decide cerrar sesión, el frontend limpia los datos almacenados en localStorage (incluyendo el JWT y CSRF token), y el backend invalida el JWT. El usuario es redirigido a la página de login, y cualquier intento futuro de acceder a áreas protegidas será rechazado.

## Tests E2E

Los tests se implementaron usando **Playwright v1.56.1**, una herramienta moderna de automatización de navegadores que permite pruebas confiables y sin flakiness.

### Flujos cubiertos

Los tests cubren los siguientes flujos de la aplicación:

1. **Autenticación**
   - Verificación de que la página de login se muestra correctamente
   - Login exitoso con credenciales válidas
   - Login fallido con contraseña incorrecta
   - Redirección correcta después del login

2. **Gestión de publicaciones (cuando está autenticado)**
   - Creación de nuevas publicaciones
   - Visualización del listado de publicaciones
   - Filtrado de publicaciones por tipo
   - Búsqueda de publicaciones
   - Actualización de publicaciones
   - Eliminación de publicaciones

3. **Perfiles de usuario**
   - Visualización del perfil de usuario
   - Actualización de datos del perfil
   - Visualización de publicaciones del usuario

### Estructura de tests

Cada test sigue el patrón:
- **beforeEach**: Resetea la base de datos y crea un usuario de prueba
- **test**: Ejecuta el flujo a probar
- **expect**: Verifica los resultados esperados

Los tests se pueden ejecutar con:
```bash
npm run test          # Ejecuta todos los tests
npm run test:ui       # Ejecuta con interfaz gráfica
npm run test:report   # Muestra el reporte de tests
```

## Diseño y Estilo

### Librería de estilos: Material-UI (MUI)

El proyecto utiliza **Material-UI** como librería principal de componentes y estilos.

### Decisiones de diseño

1. **Sistema de colores basado en estado**
   - **Perdido**: Gradiente rojo/rosa (`#f44336` a `#e91e63`)
   - **Encontrado**: Gradiente verde (`#4caf50` a `#66bb6a`)
   - **Resuelto**: Tag verde

2. **Componentes utilizados**
   - `Card`: Para mostrar publicaciones individuales
   - `Chip`: Para categorías, tipos y estados
   - `Dialog`: Para modales de confirmación y edición
   - `TextField`: Para formularios
   - `Button`: Para acciones principales
   - `Avatar`: Para fotos de perfil de usuarios
   - `Tooltip`: Para información adicional en hover

3. **Iconografía**
   - `@mui/icons-material` para iconos consistentes
   - Iconos como `LocationOnIcon`, `CalendarTodayIcon`, `EditIcon`, `DeleteIcon`

4. **Tipografía**
   - Fuente **Roboto** vía `@fontsource/roboto`

## Despliegue en Producción

### URL de la aplicación
La aplicación se encuentra desplegada en: **https://fullstack.dcc.uchile.cl:7161/**

### Configuración de entorno

La aplicación utiliza variables de entorno para configurar los parámetros según el ambiente (desarrollo, testing, producción). El archivo `.env` contiene la configuración actual:

**Backend** (`.env`):
- `PORT=7161`: Puerto en el que escucha el servidor
- `HOST=0.0.0.0`: Acepta conexiones desde cualquier interfaz
- `MONGODB_URI=mongodb://localhost:27017`: Base de datos MongoDB local
- `MONGODB_DBNAME=objetos_perdidos`: Nombre de la base de datos
- `TEST_MONGODB_URI` y `TEST_MONGODB_DBNAME`: Base de datos separada para tests
- `JWT_SECRET`: Clave secreta para firmar tokens JWT (debe ser fuerte en producción)

**Frontend** (`.env`):
- `VITE_BACKEND_HOST=localhost`: Host del servidor backend
- `VITE_BACKEND_PORT=7161`: Puerto del servidor backend

### Proceso de construcción y despliegue

El proyecto incluye un script que facilita el despliegue:

```bash
npm run build:ui  # Desde backend/
```

Este comando:
1. Construye la aplicación frontend con Vite
2. Copia la carpeta compilada (`dist`) al directorio `backend/`
3. El servidor Express sirve los archivos estáticos automáticamente

Para iniciar el servidor en producción:
```bash
npm start  # NODE_ENV=production
```

El servidor estará disponible en `https://fullstack.dcc.uchile.cl:7161/` sirviendo tanto la aplicación frontend como los endpoints de la API backend.
