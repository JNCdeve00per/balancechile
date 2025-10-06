# Estructura del Proyecto Balance Chile

## 📁 Estructura de Directorios

```
backend/  (Proyecto Principal - Full Stack)
│
├── 📱 client/                    # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── common/
│   │   │   └── Layout.jsx
│   │   ├── pages/               # Páginas/Vistas
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Ministries.jsx
│   │   │   ├── MinistryDetail.jsx
│   │   │   ├── Economic.jsx
│   │   │   ├── DataSources.jsx
│   │   │   └── About.jsx
│   │   ├── services/            # Servicios API
│   │   │   └── api.js
│   │   ├── hooks/               # Custom Hooks
│   │   │   └── useApi.js
│   │   ├── utils/               # Utilidades
│   │   │   └── formatters.js
│   │   ├── App.jsx              # Componente principal
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Estilos globales
│   ├── public/                  # Archivos públicos
│   ├── dist/                    # 🏗️ Build de producción (generado)
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 🔧 src/                       # Backend Node.js/Express
│   ├── config/
│   │   └── swagger.js           # Configuración Swagger
│   ├── middleware/
│   │   └── errorHandler.js      # Manejo de errores
│   ├── routes/                  # Rutas API
│   │   ├── budget.js
│   │   ├── economic.js
│   │   └── ministry.js
│   ├── services/                # Servicios backend
│   │   ├── apiService.js        # Llamadas a APIs externas
│   │   └── cacheService.js      # Sistema de caché
│   └── server.js                # 🚀 Servidor principal
│
├── 🧪 tests/                     # Tests
│   ├── api.test.js
│   ├── apiService.test.js
│   └── cache.test.js
│
├── 📄 Archivos de Configuración
│   ├── package.json             # Dependencias y scripts
│   ├── config.env               # Variables de entorno (dev)
│   ├── config.env.production    # Variables de entorno (prod)
│   ├── .gitignore
│   └── .htaccess.example        # Para cPanel
│
├── 📚 Documentación
│   ├── README.md                # Documentación principal
│   ├── DEPLOY_CPANEL.md         # Guía de despliegue
│   └── ESTRUCTURA.md            # Este archivo
│
└── 🚀 Scripts de Despliegue
    └── deploy.sh                # Script automatizado
```

## 🔄 Flujo de la Aplicación

### Desarrollo

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (Vite)        │  HTTP   │   (Express)     │
│   Port 5173     │ ──────> │   Port 3001     │
│                 │         │                 │
│   React App     │         │   API Routes    │
└─────────────────┘         └─────────────────┘
                                     │
                                     │ HTTP
                                     ▼
                            ┌─────────────────┐
                            │  External APIs  │
                            │  - datos.gob.cl │
                            │  - DIPRES       │
                            │  - Banco Central│
                            └─────────────────┘
```

### Producción

```
┌──────────────────────────────────────────┐
│         Node.js Server (Port 3001)       │
│  ┌────────────────────────────────────┐  │
│  │  Express.js                        │  │
│  │                                    │  │
│  │  ┌──────────┐    ┌─────────────┐  │  │
│  │  │  Static  │    │  API Routes │  │  │
│  │  │  Files   │    │  /api/*     │  │  │
│  │  │  (React) │    │             │  │  │
│  │  └──────────┘    └─────────────┘  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
                │
                │ HTTP
                ▼
       ┌─────────────────┐
       │  External APIs  │
       └─────────────────┘
```

## 🌐 Rutas de la Aplicación

### Frontend (React Router)

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | Dashboard | Página principal con resumen |
| `/ministries` | Ministries | Lista de ministerios |
| `/ministry/:code` | MinistryDetail | Detalle de un ministerio |
| `/economic` | Economic | Indicadores económicos |
| `/data-sources` | DataSources | Fuentes de datos |
| `/about` | About | Acerca del proyecto |

### Backend (API)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api-docs` | Documentación Swagger |
| GET | `/api/budget` | Datos de presupuesto |
| GET | `/api/budget/ministries` | Lista de ministerios |
| GET | `/api/budget/expenses` | Gastos por categoría |
| GET | `/api/economic` | Datos económicos |
| GET | `/api/economic/gdp` | PIB |
| GET | `/api/ministry/:code` | Detalle de ministerio |
| GET | `/api/ministry` | Todos los ministerios |

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18** - Librería UI
- **React Router 6** - Enrutamiento
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Recharts** - Gráficos
- **Axios** - HTTP client
- **React Query** - State management

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **Axios** - HTTP client
- **NodeCache** - Caché en memoria
- **Swagger** - Documentación API
- **Helmet** - Seguridad
- **Morgan** - Logging
- **CORS** - Cross-Origin Resource Sharing
- **Express Rate Limit** - Rate limiting

## 📦 Dependencias Principales

### Backend (`package.json`)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "node-cache": "^5.1.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "express-rate-limit": "^7.1.5",
    "dotenv": "^16.3.1"
  }
}
```

### Frontend (`client/package.json`)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "recharts": "^2.8.0",
    "axios": "^1.6.0",
    "react-query": "^3.39.3"
  }
}
```

## 🚀 Scripts NPM

### Desarrollo
```bash
npm run dev              # Inicia backend en modo desarrollo
npm run dev:frontend     # Inicia frontend en modo desarrollo
```

### Producción
```bash
npm run build           # Construye el frontend
npm start               # Inicia el servidor en producción
npm run deploy          # Build + Start
```

### Instalación
```bash
npm run install:all     # Instala todas las dependencias
```

### Testing
```bash
npm test                # Ejecuta tests
npm run test:watch      # Tests en modo watch
```

## 🔐 Variables de Entorno

### Backend (`config.env`)

```env
# Entorno
NODE_ENV=development|production
PORT=3001

# Caché
USE_REDIS=false
API_CACHE_TTL=3600

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# APIs Externas
DATOS_GOV_CL_BASE_URL=https://datos.gob.cl/api/3/action
DIPRES_BASE_URL=https://www.dipres.gob.cl/api
BANCO_CENTRAL_BASE_URL=https://si3.bcentral.cl/SieteRestWS
```

### Frontend

El frontend detecta automáticamente:
- **Desarrollo:** `http://localhost:3001`
- **Producción:** Rutas relativas (mismo servidor)

## 📝 Notas Importantes

1. **Caché:** Por defecto usa NodeCache (en memoria). Redis está disponible pero desactivado.

2. **CORS:** Solo se habilita en desarrollo. En producción no es necesario ya que frontend y backend están en el mismo servidor.

3. **Build del Frontend:** Debe ejecutarse antes de desplegar en producción (`npm run build`).

4. **Archivos Estáticos:** En producción, Express sirve los archivos de `client/dist/`.

5. **Enrutamiento SPA:** Todas las rutas no-API se redirigen a `index.html` para que React Router maneje la navegación.

## 🎯 Ventajas de esta Estructura

✅ **Un solo servidor:** Simplifica el despliegue
✅ **Sin problemas de CORS:** Frontend y backend en el mismo origen
✅ **Fácil de desplegar en cPanel:** Compatible con hosting compartido
✅ **Desarrollo separado:** Frontend y backend pueden desarrollarse independientemente
✅ **Build optimizado:** Vite genera un bundle optimizado
✅ **SEO friendly:** Puede agregar SSR si es necesario
✅ **Escalable:** Puede separarse fácilmente si crece el proyecto
