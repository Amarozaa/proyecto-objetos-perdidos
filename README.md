

# 📦 Instrucciones para correr el proyecto

## 1. Clona el repositorio

```bash
git clone https://github.com/Amarozaa/proyecto-objetos-perdidos
```

## 2. Variables de entorno requeridas

Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```env
PORT=3001
HOST=localhost
MONGODB_URI=mongodb://localhost:27017
MONGODB_DBNAME=lab7
JWT_SECRET=miclavesecreta
```
Puedes usar el archivo `env.example` como referencia.

## 3. Pre-requisitos

- Tener MongoDB corriendo en tu computador.
- Tener el archivo `.env` configurado en la carpeta `backend` (ver arriba).

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
