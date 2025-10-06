# 🇨🇱 Balance Chile - Proyecto Unificado

> Dashboard del Presupuesto Público de Chile - Aplicación Full Stack

## 🎯 Cambio Importante

Este proyecto ha sido **reorganizado** de una arquitectura separada a una **aplicación full-stack unificada**.

### ¿Qué significa esto?

- ✅ **Un solo servidor** en producción (Node.js + Express)
- ✅ **Un solo puerto** (el backend sirve el frontend)
- ✅ **Sin problemas de CORS** en producción
- ✅ **Fácil de desplegar** en cPanel y hosting compartido
- ✅ **Desarrollo flexible** (frontend y backend separados en dev)

## 📁 Estructura Actual

```
balanceChile/
├── backend/              ⭐ PROYECTO PRINCIPAL (Full Stack)
│   ├── client/          → Frontend React (integrado)
│   ├── src/             → Backend Node.js/Express
│   ├── package.json     → Dependencias y scripts
│   ├── README.md        → Documentación completa
│   ├── deploy.sh        → Script de despliegue
│   └── ...              → Archivos de configuración
│
├── frontend/            ⚠️  DEPRECADO (usar backend/client/)
├── balance-chile-api/   ⚠️  DEPRECADO (usar backend/)
└── balance-chile-frontend/ ⚠️ DEPRECADO (usar backend/client/)
```

## 🚀 Inicio Rápido

### 1. Navegar al proyecto principal

```bash
cd backend
```

### 2. Instalar dependencias

```bash
npm run install:all
```

### 3. Iniciar en modo desarrollo

```bash
./start-dev.sh
```

O manualmente:
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run dev:frontend
```

### 4. Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api
- **API Docs:** http://localhost:3001/api-docs

## 📚 Documentación Completa

Toda la documentación está en el directorio `backend/`:

| Archivo | Descripción |
|---------|-------------|
| **README.md** | Documentación principal completa |
| **INICIO_RAPIDO.md** | Guía de inicio rápido |
| **ESTRUCTURA.md** | Explicación de la arquitectura |
| **DEPLOY_CPANEL.md** | Guía completa de despliegue en cPanel |
| **CPANEL_PASO_A_PASO.md** | Instrucciones visuales para cPanel |
| **CHECKLIST.md** | Lista de verificación completa |
| **RESUMEN_CAMBIOS.md** | Detalles de todos los cambios |

## 🔧 Comandos Principales

```bash
# Desarrollo
npm run dev              # Iniciar backend
npm run dev:frontend     # Iniciar frontend
./start-dev.sh          # Iniciar ambos

# Producción
npm run build           # Construir frontend
npm start               # Iniciar servidor

# Despliegue
./deploy.sh             # Preparar para desplegar
```

## 🌐 Despliegue en cPanel

### Preparación

```bash
cd backend
./deploy.sh
```

### Subir a cPanel

1. Subir `balance-chile-deploy.tar.gz` al servidor
2. Extraer archivos
3. Configurar Node.js App en cPanel
4. Instalar dependencias: `npm install --production`
5. Iniciar aplicación

**Guía detallada:** Ver `backend/DEPLOY_CPANEL.md`

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

## 📦 Tecnologías

### Frontend
- React 18
- Vite
- Tailwind CSS
- Recharts
- React Router

### Backend
- Node.js
- Express
- Axios
- NodeCache
- Swagger

## 🔐 Configuración

### Variables de Entorno

Archivo: `backend/config.env`

```env
NODE_ENV=development|production
PORT=3001
USE_REDIS=false
API_CACHE_TTL=3600
```

## 🎯 Ventajas de la Nueva Arquitectura

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Servidores | 2 | 1 |
| Puertos | 2 | 1 |
| CORS | Siempre | Solo en dev |
| Despliegue | Complejo | Simple |
| cPanel | Difícil | Fácil |

## 🔄 Migración

Si estabas usando la versión anterior:

1. **Dejar de usar:**
   - `frontend/` (deprecado)
   - `balance-chile-api/` (deprecado)
   - `balance-chile-frontend/` (deprecado)

2. **Usar ahora:**
   - `backend/` (proyecto principal)
   - `backend/client/` (frontend)
   - `backend/src/` (backend)

3. **Actualizar scripts:**
   ```bash
   cd backend
   npm run install:all
   ```

## 📞 Soporte

### Documentación
- Ver archivos en `backend/`
- Consultar `CHECKLIST.md` para verificación

### Problemas Comunes
- Ver `DEPLOY_CPANEL.md` sección "Troubleshooting"
- Revisar logs del servidor
- Verificar variables de entorno

## 🤝 Contribuir

Ver `CONTRIBUTING.md` para detalles sobre cómo contribuir al proyecto.

## 📄 Licencia

MIT

---

## ⚠️ Nota Importante

**Los directorios `frontend/`, `balance-chile-api/` y `balance-chile-frontend/` están deprecados.**

**Usar únicamente el directorio `backend/` que contiene el proyecto completo y unificado.**

---

## 🎉 ¡Empezar Ahora!

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
