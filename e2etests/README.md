# Pruebas E2E

Esta carpeta contiene pruebas end-to-end para la aplicación Objetos Perdidos utilizando Playwright.

## Prerrequisitos

- Node.js instalado
- Backend ejecutándose en `http://localhost:3001` en modo test
- Frontend ejecutándose en `http://localhost:8080`

## Configuración

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Instalar navegadores de Playwright:
   ```bash
   npx playwright install
   ```

## Ejecutar Pruebas

Para ejecutar todas las pruebas:
```bash
npm test
```

Para ejecutar pruebas en modo UI:
```bash
npm run test:ui
```

Para ver reportes de pruebas:
```bash
npm run test:report
```

## Cobertura de Pruebas

- Funcionalidad de login y acceso protegido
- Operaciones CRUD en publicaciones (Crear, Leer)