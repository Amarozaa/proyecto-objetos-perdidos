
# 📦 Instrucciones para correr el proyecto

## 1. Clona el repositorio

```bash
# Clona el repo
git clone https://github.com/Amarozaa/proyecto-objetos-perdidos
```

## 2. Pre-requisitos

- Tener MongoDB corriendo en tu computador.
- Tener el archivo `.env` configurado en la carpeta `backend` (ver `.env.example`).

## 3. Instalación y ejecución

Desde la raíz del proyecto, ejecuta:

```bash
cd backend
npm install
npm run build:ui // npm run build:uiw en caso de windows
npm run build
npm run start
```

Esto compilará el frontend y backend, y levantará el servidor.

La aplicación estará disponible en `localhost` y el puerto definido en tu archivo `.env`.

---

- Actualmente no hay imágenes de prueba, ya que el backend y almacenamiento de imágenes aún no está implementado.
- Si tienes problemas, revisa que MongoDB esté corriendo, que el archivo `.env` esté presente y que no haya conflictos de puertos.
