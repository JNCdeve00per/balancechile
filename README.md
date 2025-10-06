# Balance Chile 🇨🇱

Dashboard interactivo del Presupuesto Público de Chile - Transparencia fiscal para todos los ciudadanos.

![Balance Chile](https://img.shields.io/badge/Chile-Presupuesto%20P%C3%BAblico-red)
![React](https://img.shields.io/badge/React-18+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm run install:all

# 2. Iniciar en desarrollo
./start-dev.sh
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| **INICIO_RAPIDO.md** | Guía de inicio rápido |
| **ESTRUCTURA.md** | Arquitectura del proyecto |
| **DEPLOY_CPANEL.md** | Guía de despliegue en cPanel |
| **CPANEL_PASO_A_PASO.md** | Instrucciones visuales |
| **CHECKLIST.md** | Lista de verificación |
| **RESUMEN_CAMBIOS.md** | Detalles de cambios |

## 🎯 Descripción

Balance Chile es una plataforma web que democratiza el acceso a la información del presupuesto público chileno. Conecta con APIs oficiales del gobierno para mostrar datos actualizados sobre:

- **Presupuesto Nacional**: ~88 billones CLP (2025)
- **24 Ministerios** del gobierno central
- **Indicadores Económicos**: PIB, inflación, desempleo
- **Distribución del Gasto**: Personal, programas e inversión
- **Datos Históricos**: Evolución presupuestaria 2020-2025

## 🚀 Características

- ✅ **Un solo servidor** en producción
- ✅ **Sin problemas de CORS**
- ✅ **Fácil de desplegar** en cPanel
- ✅ **Desarrollo flexible** (frontend y backend separados)
- ✅ **Datos Oficiales**: BCN, DIPRES, Banco Central
- ✅ **Visualizaciones Interactivas**: Gráficos con Recharts
- ✅ **Cache Inteligente**: NodeCache para rendimiento
- ✅ **API REST Documentada**: Swagger/OpenAPI
- ✅ **Responsive Design**: TailwindCSS
- ✅ **Open Source**: Licencia MIT

## 🛠️ Stack Tecnológico

### Frontend
- React 18 con Vite
- Tailwind CSS
- Recharts para visualizaciones
- React Router
- Axios

### Backend
- Node.js con Express
- Sistema de caché en memoria (NodeCache)
- Integración con APIs oficiales
- Documentación Swagger
- Rate limiting y seguridad

## 🏗️ Estructura del Proyecto

```
balanceChile/
├── client/              # Frontend React
│   ├── src/            # Código fuente
│   └── dist/           # Build (generado)
├── src/                # Backend Node.js
│   ├── routes/         # API routes
│   ├── services/       # Servicios
│   └── server.js       # Servidor principal
├── app.js              # Punto de entrada
├── package.json
├── config.env
└── [documentación]
```

## 🏗️ Arquitectura

### Desarrollo
```
Frontend (Vite)          Backend (Express)
Port 5173        ──────> Port 3001
                 Proxy   
```

### Producción
```
Node.js Server (Port 3001)
├── Express.js
│   ├── Static Files (React) → /
│   └── API Routes → /api/*
└── External APIs
```

## 🌐 Despliegue en cPanel

```bash
# 1. Preparar el proyecto
./deploy.sh

# 2. Subir a cPanel
# Seguir guía en CPANEL_PASO_A_PASO.md
```

**Archivos a subir:**
- `app.js` - Punto de entrada
- `src/` - Backend
- `client/dist/` - Frontend construido
- `package.json`
- `config.env`

## 🔄 Comandos Principales

```bash
# Desarrollo
npm run dev              # Backend
npm run dev:frontend     # Frontend
./start-dev.sh          # Ambos

# Producción
npm run build           # Construir
npm start               # Iniciar

# Despliegue
./deploy.sh             # Preparar
```

## 📊 APIs Integradas

- **DIPRES**: Datos presupuestarios oficiales
- **Banco Central de Chile**: Indicadores económicos
- **datos.gob.cl**: Portal de datos abiertos
- **BCN (Biblioteca del Congreso Nacional)**: Información legislativa

## 🤝 Contribuir

Ver `CONTRIBUTING.md` para detalles sobre cómo contribuir al proyecto.

## 📄 Licencia

MIT

---

**Para empezar ahora:**

```bash
npm run install:all
./start-dev.sh
```

**¡Listo para desarrollar y desplegar! 🚀**