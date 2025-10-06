# Balance Chile - Full Stack Application

Dashboard del Presupuesto Público de Chile con React en el frontend y Node.js/Express en el backend.

## 🏗️ Estructura del Proyecto

```
backend/
├── client/              # Frontend React (Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── src/                 # Backend Node.js/Express
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── server.js
├── tests/
├── config.env
└── package.json
```

## 🚀 Instalación

### 1. Instalar dependencias del backend y frontend

```bash
npm run install:all
```

O manualmente:

```bash
# Backend
npm install

# Frontend
cd client && npm install
```

## 💻 Desarrollo Local

### Opción 1: Backend y Frontend por separado (Recomendado)

**Terminal 1 - Backend:**
```bash
npm run dev
```
El backend correrá en `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
El frontend correrá en `http://localhost:5173`

### Opción 2: Solo Backend (modo producción local)

```bash
# Primero construir el frontend
npm run build

# Luego iniciar en modo producción
NODE_ENV=production npm start
```

## 📦 Build para Producción

```bash
# Construir el frontend
npm run build

# Esto genera los archivos estáticos en client/dist/
```

## 🌐 Despliegue en cPanel

### Preparación

1. **Construir el proyecto localmente:**
   ```bash
   npm run build
   ```

2. **Archivos a subir al servidor:**
   - Toda la carpeta `src/`
   - `client/dist/` (archivos construidos del frontend)
   - `package.json`
   - `config.env` (configurado para producción)
   - `node_modules/` (o instalar en el servidor)

### Configuración en cPanel

1. **Subir archivos:**
   - Usa el File Manager o FTP para subir los archivos
   - Colócalos en tu directorio de aplicación Node.js

2. **Variables de entorno (config.env):**
   ```env
   NODE_ENV=production
   PORT=3001
   USE_REDIS=false
   API_CACHE_TTL=3600
   RATE_LIMIT_WINDOW=900000
   RATE_LIMIT_MAX=100
   ```

3. **Instalar dependencias en el servidor:**
   ```bash
   npm install --production
   ```

4. **Configurar la aplicación Node.js en cPanel:**
   - Ve a "Setup Node.js App"
   - Node.js version: 18.x o superior
   - Application mode: Production
   - Application root: tu directorio
   - Application URL: tu dominio
   - Application startup file: `src/server.js`

5. **Variables de entorno en cPanel:**
   Agrega en la sección de variables de entorno:
   - `NODE_ENV=production`
   - `PORT=3001` (o el puerto que te asigne cPanel)

6. **Iniciar la aplicación:**
   - Haz clic en "Start App" en cPanel

### Estructura de URLs en Producción

- `https://tudominio.com/` → Frontend React
- `https://tudominio.com/api/*` → API Backend
- `https://tudominio.com/api-docs` → Documentación Swagger
- `https://tudominio.com/health` → Health Check

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run dev:frontend` - Inicia el frontend en modo desarrollo
- `npm run build` - Construye el frontend para producción
- `npm run install:all` - Instala dependencias del backend y frontend
- `npm test` - Ejecuta los tests
- `npm run deploy` - Build + Start (útil para despliegue)

## 📝 Configuración

### Backend (config.env)

```env
NODE_ENV=development|production
PORT=3001
USE_REDIS=false
API_CACHE_TTL=3600
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Frontend

El frontend detecta automáticamente el entorno:
- **Desarrollo:** Usa `http://localhost:3001` para la API
- **Producción:** Usa rutas relativas (mismo servidor)

## 🔒 Seguridad

- Helmet para headers de seguridad
- Rate limiting en rutas API
- CORS configurado según entorno
- Variables de entorno para configuración sensible

## 📊 Caché

El proyecto usa caché en memoria (NodeCache) por defecto. Redis está desactivado pero puede habilitarse configurando `USE_REDIS=true` y proporcionando `REDIS_URL`.

## 🐛 Troubleshooting

### El frontend no carga en producción
- Verifica que ejecutaste `npm run build`
- Verifica que `NODE_ENV=production`
- Verifica que la carpeta `client/dist` existe

### Errores de API
- Verifica que el backend esté corriendo
- Revisa los logs del servidor
- Verifica la configuración de CORS

### Puerto en uso
```bash
# Cambiar el puerto en config.env
PORT=3002
```

## 📚 Documentación API

Una vez iniciado el servidor, visita:
- Desarrollo: `http://localhost:3001/api-docs`
- Producción: `https://tudominio.com/api-docs`

## 🤝 Contribuir

Ver [CONTRIBUTING.md](../CONTRIBUTING.md) para detalles sobre cómo contribuir al proyecto.

## 📄 Licencia

MIT
