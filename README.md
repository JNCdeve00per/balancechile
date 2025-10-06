# Balance Chile 🇨🇱

Dashboard interactivo del Presupuesto Público de Chile - Transparencia fiscal para todos los ciudadanos.

![Balance Chile](https://img.shields.io/badge/Chile-Presupuesto%20P%C3%BAblico-red)
![React](https://img.shields.io/badge/React-18+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## ⚠️ IMPORTANTE: Proyecto Unificado

Este proyecto ha sido **reorganizado** en una arquitectura full-stack unificada.

### 📁 Todo el código está ahora en el directorio `backend/`

```bash
# Navegar al proyecto principal
cd backend

# Ver documentación completa
cat README.md
```

## 🚀 Inicio Rápido

```bash
# 1. Ir al directorio principal
cd backend

# 2. Instalar dependencias
npm run install:all

# 3. Iniciar en desarrollo
./start-dev.sh
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

## 📚 Documentación Completa

Toda la documentación está en `backend/`:

| Archivo | Descripción |
|---------|-------------|
| **README.md** | Documentación principal completa |
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
cd backend
./deploy.sh

# 2. Subir a cPanel
# Seguir guía en backend/CPANEL_PASO_A_PASO.md
```

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

## 🔗 Enlaces Útiles

- **Documentación Completa**: `backend/README.md`
- **Guía de Despliegue**: `backend/DEPLOY_CPANEL.md`
- **Inicio Rápido**: `backend/INICIO_RAPIDO.md`

---

**Para empezar ahora:**

```bash
cd backend
cat INICIO_RAPIDO.md
```

O directamente:

```bash
cd backend
npm run install:all
./start-dev.sh
```

**¡Listo para desarrollar y desplegar! 🚀**