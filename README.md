# 📦 Instrucciones para correr el proyecto

## 1. Clona el repositorio

```bash
git clone https://github.com/Amarozaa/proyecto-objetos-perdidos
```

## 2. Variables de entorno requeridas

Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```env
PORT=3000
HOST=localhost
MONGODB_URI=mongodb://localhost:27017
MONGODB_DBNAME=objetos_perdidos
JWT_SECRET=miclavesecreta
```
Puedes usar el archivo `env.example` como referencia.

## 3. Pre-requisitos

- Tener MongoDB corriendo en tu computador o usando Docker.
- Tener el archivo `.env` configurado en la carpeta `backend` (ver arriba).

### Configuración de MongoDB

Para desarrollo, puedes usar MongoDB sin autenticación. Si obtienes el error "Command find requires authentication", significa que MongoDB está corriendo con autenticación habilitada (--auth), lo cual no es necesario para desarrollo local.

#### Opción 1: Usando Docker (recomendado)

Ejecuta MongoDB en un contenedor Docker sin autenticación:

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

Esto iniciará MongoDB en el puerto 27017 sin requerir usuario/contraseña.

#### Opción 2: Instalación local

Si tienes MongoDB instalado localmente, asegúrate de que esté corriendo sin autenticación. Si lo iniciaste con `--auth`, detén el proceso y reinícialo sin esa opción.

## 4. Instalación y ejecución local


Desde la raíz del proyecto, ejecuta:

```bash
# Nos movemos a la carpeta del backend
cd backend

# Instalamos todos los paquetes y librerías necesarias
npm install

# Construimos el frontend
npm run build:ui # Linux
npm run build:uiw # Windows

# Construimos el backend
npm run build

# Ejecutamos la aplicación
npm run start
```

Esto compilará el frontend y backend, y levantará el servidor.

La aplicación estará disponible en `localhost` y el puerto definido en tu archivo `.env`.

---

- Actualmente no hay imágenes de prueba, ya que el almacenamiento de imágenes aún no está implementado.
- Si tienes problemas, revisa que MongoDB esté corriendo, que el archivo `.env` esté presente y que no haya conflictos de puertos.
