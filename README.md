# Balance Chile 🇨🇱

Dashboard interactivo del Presupuesto Público de Chile - Transparencia fiscal para todos los ciudadanos.

![Balance Chile](https://img.shields.io/badge/Chile-Presupuesto%20P%C3%BAblico-red)
![React](https://img.shields.io/badge/React-18+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 🎯 Descripción

Balance Chile es una plataforma web que democratiza el acceso a la información del presupuesto público chileno. Conecta con APIs oficiales del gobierno para mostrar datos actualizados sobre:

- **Presupuesto Nacional**: ~88 billones CLP (2025) - ~92.000 millones USD - Fuente: [DIPRES](https://www.gob.cl/noticias/presupuesto-2025/)
- **Crecimiento Presupuestario**: +2.7% respecto a 2024
- **24 Ministerios** del gobierno central (+ propuesta de Ministerio de Seguridad Pública)
- **Indicadores Económicos**: PIB, inflación, desempleo
- **Distribución del Gasto**: Personal, programas e inversión
- **Datos Históricos**: Evolución presupuestaria 2020-2025

## 🚀 Características

- ✅ **Sistema Dinámico**: Datos cambian automáticamente por año (2020-2025)
- ✅ **Datos Oficiales**: BCN, DIPRES, Banco Central, datos.gob.cl
- ✅ **Visualizaciones Interactivas**: Gráficos con Recharts
- ✅ **Cache Inteligente**: Redis para optimizar rendimiento
- ✅ **API REST Documentada**: Swagger/OpenAPI
- ✅ **Responsive Design**: TailwindCSS
- ✅ **Docker Ready**: Despliegue containerizado
- ✅ **Testing**: Jest + Vitest
- ✅ **Fallback Automático**: Datos demo si APIs fallan
- ✅ **Open Source**: Licencia MIT

## 🔄 Sistema Dinámico de Datos

### Cambio Automático por Año
La aplicación ahora responde dinámicamente al cambio de año en la interfaz:

- **2025**: Presupuesto de $88B CLP con enfoque en seguridad pública
- **2024**: Presupuesto de $42.2B CLP con datos oficiales de BCN  
- **2023**: Presupuesto de $40.7B CLP con efectos post-pandemia
- **2022**: Presupuesto de $39.1B CLP con mayor inversión en salud
- **2021**: Presupuesto de $37.0B CLP (impacto COVID-19)
- **2020**: Presupuesto de $37.8B CLP con medidas de emergencia

### Variaciones Realistas
- **Educación**: Mayor inversión en años recientes
- **Salud**: Incremento significativo durante pandemia (2020-2022)
- **Seguridad**: Prioridad en presupuesto 2025
- **Crecimiento**: Reflejan condiciones económicas reales de cada año

### Indicador Visual
- 🟢 **Datos Oficiales**: Cuando conectado a APIs reales
- 🟡 **Datos Demo**: Información de demostración basada en fuentes oficiales
- 🔄 **Actualización**: Indicador visual al cambiar años

## 🏗️ Arquitectura

```
balance-chile/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── routes/   # Endpoints REST
│   │   ├── services/ # Lógica de negocio
│   │   └── config/   # Configuración
│   └── tests/        # Tests con Jest
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── pages/    # Páginas principales
│   │   ├── components/ # Componentes reutilizables
│   │   └── hooks/    # Custom hooks
│   └── tests/        # Tests con Vitest
└── docker-compose.yml # Orquestación completa
```

## 🛠️ Tecnologías

### Backend
- **Node.js 18+** - Runtime de JavaScript
- **Express** - Framework web minimalista
- **Redis** - Cache en memoria
- **Axios** - Cliente HTTP
- **Swagger** - Documentación API
- **Jest** - Testing framework

### Frontend
- **React 18** - Biblioteca UI con hooks
- **Vite** - Build tool rápido
- **React Router** - Enrutamiento SPA
- **React Query** - Estado del servidor
- **Recharts** - Gráficos interactivos
- **TailwindCSS** - Framework CSS utility-first
- **Vitest** - Testing framework

## 📋 Requisitos Previos

- **Node.js** 18+ y npm
- **Docker** y Docker Compose (opcional)
- **Redis** (opcional, usa cache en memoria como fallback)

## ⚡ Instalación Rápida

### Opción 1: Docker Compose (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/balance-chile.git
cd balance-chile

# Levantar todos los servicios
docker-compose up --build

# Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# Documentación: http://localhost:3001/api-docs
```

### Opción 2: Instalación Manual

```bash
# Instalar dependencias de todos los proyectos
npm run install:all

# Ejecutar en modo desarrollo
npm run dev

# O ejecutar por separado:
npm run dev:backend   # Puerto 3001
npm run dev:frontend  # Puerto 5173
```

## 🔧 Configuración

### Variables de Entorno (Backend)

Copia `backend/config.env` y ajusta según tu entorno:

```env
# Servidor
NODE_ENV=development
PORT=3001

# Redis (opcional)
REDIS_URL=redis://localhost:6379

# APIs Externas
DATOS_GOV_CL_BASE_URL=https://datos.gob.cl/api/3/action
DIPRES_BASE_URL=https://www.dipres.gob.cl/api
BANCO_CENTRAL_BASE_URL=https://si3.bcentral.cl/SieteRestWS

# Cache y Rate Limiting
API_CACHE_TTL=3600
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Variables de Entorno (Frontend)

```env
VITE_API_URL=http://localhost:3001
```

## 📡 API Endpoints

### Presupuesto
- `GET /api/budget` - Datos del presupuesto nacional
- `GET /api/budget/ministries` - Lista de ministerios
- `GET /api/budget/expenses` - Distribución de gastos

### Economía
- `GET /api/economic` - Indicadores económicos
- `GET /api/economic/gdp` - Datos del PIB

### Ministerios
- `GET /api/ministry` - Todos los ministerios
- `GET /api/ministry/:code` - Detalles de un ministerio

### Utilidades
- `GET /health` - Health check
- `GET /api-docs` - Documentación Swagger

## 🧪 Testing

```bash
# Tests del backend
cd backend && npm test

# Tests del frontend
cd frontend && npm test

# Tests con coverage
npm test -- --coverage

# Tests en modo watch
npm test -- --watch
```

## 📊 Uso de la Aplicación

### Dashboard Principal
- Visualiza el presupuesto total y principales métricas
- Gráficos interactivos de distribución por ministerio
- Comparación de gastos: personal vs programas vs inversión

### Vista de Ministerios
- Lista completa de los 28 ministerios
- Búsqueda y filtros avanzados
- Ordenamiento por presupuesto o nombre

### Detalle de Ministerio
- Información específica de cada ministerio
- Distribución interna del presupuesto
- Evolución histórica 2020-2024

### Indicadores Económicos
- PIB nacional y crecimiento
- Inflación y desempleo
- Deuda pública como % del PIB

## 🌐 Fuentes de Datos

- **[BCN - Biblioteca del Congreso Nacional](https://www.bcn.cl/presupuesto/periodo/2024)** - Presupuesto Nacional 2024
- **[DIPRES](https://www.dipres.gob.cl)** - Dirección de Presupuestos
- **[Datos Abiertos](https://datos.gob.cl)** - Portal oficial del gobierno
- **[Banco Central](https://www.bcentral.cl)** - Indicadores macroeconómicos
- **[Contraloría General](https://www.contraloria.cl)** - Control del gasto público

## 🚀 Despliegue en Producción

### Docker Compose (Recomendado)

```bash
# Producción con Docker
docker-compose -f docker-compose.prod.yml up -d

# Con reverse proxy (Nginx)
docker-compose -f docker-compose.prod.yml -f docker-compose.nginx.yml up -d
```

### Manual

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Servir archivos estáticos con nginx/apache
```

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

### Guías de Contribución

- Usa **Conventional Commits** para mensajes
- Agrega **tests** para nuevas funcionalidades
- Actualiza la **documentación** cuando sea necesario
- Sigue las **convenciones de código** existentes

## 📈 Roadmap

- [ ] **APIs Reales**: Integración con endpoints oficiales
- [ ] **Más Visualizaciones**: Mapas regionales, treemaps
- [ ] **Alertas**: Notificaciones de cambios presupuestarios
- [ ] **Exportación**: PDF, Excel, CSV
- [ ] **Comparaciones**: Entre años y regiones
- [ ] **Mobile App**: React Native
- [ ] **Análisis IA**: Insights automáticos

## 🐛 Reportar Issues

¿Encontraste un bug o tienes una sugerencia?

1. Revisa los [issues existentes](https://github.com/tu-usuario/balance-chile/issues)
2. Crea un [nuevo issue](https://github.com/tu-usuario/balance-chile/issues/new) con:
   - Descripción detallada
   - Pasos para reproducir
   - Screenshots si aplica
   - Información del entorno

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

Desarrollado con ❤️ para promover la transparencia fiscal en Chile.

- **Desarrollo**: Comunidad Open Source
- **Datos**: Gobierno de Chile (fuentes oficiales)
- **Inspiración**: Ciudadanos que creen en la transparencia

## 🙏 Agradecimientos

- **DIPRES** por la transparencia en datos presupuestarios
- **Gobierno Digital** por las APIs de datos abiertos
- **Comunidad Open Source** por las herramientas utilizadas
- **Ciudadanos** que demandan transparencia fiscal

---

**Balance Chile** - *Presupuesto público transparente para todos* 🇨🇱

[![GitHub](https://img.shields.io/badge/GitHub-balance--chile-blue?logo=github)](https://github.com/tu-usuario/balance-chile)
[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-green.svg)](LICENSE)
[![Contribuciones bienvenidas](https://img.shields.io/badge/Contribuciones-bienvenidas-brightgreen.svg)](CONTRIBUTING.md)
