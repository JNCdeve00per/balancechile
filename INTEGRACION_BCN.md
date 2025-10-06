# Integración BCN - Biblioteca del Congreso Nacional

## Descripción

Este documento describe la integración con la Biblioteca del Congreso Nacional de Chile (BCN) para obtener datos oficiales del presupuesto público.

## Fuente de Datos

- **URL Base**: https://www.bcn.cl/presupuesto
- **Endpoint por año**: https://www.bcn.cl/presupuesto/periodo/[año]
- **Años disponibles**: 2010 - 2026 (año actual + 1)

## Arquitectura de la Integración

### Backend

#### 1. Servicio BCN (`src/services/bcnService.js`)

Servicio dedicado para interactuar con el sitio web de BCN:

**Características principales:**
- Web scraping con Cheerio para extraer datos HTML
- Cache de 24 horas para reducir carga en el servidor BCN
- Fallback automático a datos mock si BCN no está disponible
- Parseo inteligente de montos y porcentajes
- Transformación de datos al formato estándar de la aplicación

**Métodos principales:**
```javascript
// Obtener datos de presupuesto para un año
await bcnService.getBudgetData(year)

// Verificar disponibilidad del servicio
await bcnService.checkAvailability()

// Obtener años disponibles
bcnService.getAvailableYears()

// Transformar datos BCN al formato estándar
bcnService.transformToStandardFormat(bcnData)
```

#### 2. Integración en API Service (`src/services/apiService.js`)

El servicio principal de API prioriza BCN como fuente de datos:

**Orden de prioridad:**
1. **BCN** (Biblioteca del Congreso Nacional) - Fuente principal
2. DIPRES (si estuviera disponible) - Fallback secundario
3. Datos Abiertos (si estuviera disponible) - Fallback terciario
4. Datos Mock - Último recurso

```javascript
// El método getRealBudgetData() intenta BCN primero
const data = await apiService.getBudgetData(2024)
// Automáticamente usa BCN si está disponible
```

#### 3. Rutas API

**Nuevas rutas agregadas:**

```
GET /api/budget/bcn?year=2024
- Obtiene datos crudos de BCN para un año específico
- Incluye todas las partidas presupuestarias

GET /api/budget/bcn/availability
- Verifica si el servicio BCN está disponible
- Útil para monitoreo y health checks

GET /api/budget/bcn/years
- Lista todos los años disponibles en BCN
- Rango: 2010 hasta año actual + 1
```

**Rutas existentes mejoradas:**

```
GET /api/budget?year=2024
- Ahora usa datos de BCN automáticamente si están disponibles
- Incluye campo "dataSource": "BCN" en la respuesta

GET /api/budget/ministries?year=2024
- Agrupa partidas de BCN por ministerio
- Calcula totales y porcentajes de ejecución

GET /api/budget/data-sources
- Muestra estado de integración de BCN
- Indica qué años tienen datos disponibles
```

### Frontend

#### 1. Nueva Página: Datos BCN (`client/src/pages/BcnData.jsx`)

Página dedicada para visualizar datos de BCN:

**Características:**
- Selector de año (2010-2026)
- Indicador de disponibilidad del servicio BCN
- Resumen de totales presupuestarios:
  - Presupuesto Aprobado
  - Modificaciones
  - Presupuesto Vigente
  - Devengado
  - % de Ejecución
- Tabla detallada de partidas presupuestarias
- Enlaces directos a BCN para verificación

**Acceso:**
- URL: `/bcn`
- Menú de navegación: "Datos BCN"

#### 2. API Client (`client/src/services/api.js`)

Nuevos métodos agregados:

```javascript
import { budgetApi } from './services/api'

// Obtener datos BCN
const response = await budgetApi.getBcnData(2024)

// Verificar disponibilidad
const status = await budgetApi.getBcnAvailability()

// Obtener años disponibles
const years = await budgetApi.getBcnYears()
```

#### 3. Actualización de Páginas Existentes

**DataSources.jsx:**
- Banner destacado sobre integración BCN
- Botón de acceso rápido a datos BCN
- Información actualizada sobre fuentes integradas

**Dashboard.jsx:**
- Ahora muestra datos de BCN automáticamente cuando están disponibles
- Indicador de fuente de datos en la UI

## Estructura de Datos

### Datos Crudos de BCN

```json
{
  "year": 2024,
  "source": "BCN - Biblioteca del Congreso Nacional",
  "sourceUrl": "https://www.bcn.cl/presupuesto/periodo/2024",
  "lastUpdated": "2024-10-06T...",
  "isRealData": true,
  "totales": {
    "aprobado": 88000000000000,
    "modificaciones": 2000000000000,
    "vigente": 90000000000000,
    "devengado": 72000000000000,
    "porcentajeEjecucion": 80.0
  },
  "partidas": [
    {
      "numero": "01",
      "nombre": "Ministerio de Educación",
      "aprobado": 15400000000000,
      "modificaciones": 200000000000,
      "vigente": 15600000000000,
      "devengado": 12480000000000,
      "porcentajeEjecucion": 80.0
    }
    // ... más partidas
  ],
  "partidasCount": 25
}
```

### Datos Transformados (Formato Estándar)

```json
{
  "year": 2024,
  "totalBudget": 90000000000000,
  "totalApproved": 88000000000000,
  "totalModifications": 2000000000000,
  "totalExecuted": 72000000000000,
  "executionPercentage": 80.0,
  "currency": "CLP",
  "dataSource": "BCN",
  "isRealData": true,
  "ministries": [
    {
      "code": "MINEDUC",
      "name": "Ministerio de Educación",
      "budget": 15600000000000,
      "approved": 15400000000000,
      "modifications": 200000000000,
      "current": 15600000000000,
      "executed": 12480000000000,
      "executionPercentage": 80.0,
      "percentage": 17.3,
      "partidas": [...]
    }
    // ... más ministerios
  ]
}
```

## Manejo de Errores y Fallbacks

### Escenarios de Error

1. **BCN no disponible (503, timeout)**
   - Se intenta obtener datos del cache (stale data)
   - Si no hay cache, se usa datos mock
   - Se registra el error en logs

2. **Año no disponible en BCN**
   - Se retorna datos de fallback
   - Se marca como `isFallback: true`
   - Se incluye nota explicativa

3. **Error de parseo HTML**
   - Se intenta con selectores alternativos
   - Si falla, se usa datos de fallback
   - Se registra el error para debugging

4. **Datos incompletos**
   - Se valida que haya al menos una partida
   - Si no hay datos válidos, se usa fallback
   - Se marca claramente en la respuesta

### Cache Strategy

- **TTL Normal**: 24 horas (86400 segundos)
- **Stale Cache**: Se mantiene indefinidamente como backup
- **Cache Key**: `bcn_budget_{year}`
- **Invalidación**: Automática después del TTL

## Monitoreo y Debugging

### Logs

El servicio genera logs detallados:

```
✓ Successfully fetched BCN data for year 2024
BCN Cache hit for year 2024
BCN data not available or incomplete for year 2023
Error fetching BCN data for year 2022: timeout
```

### Health Check

Verificar estado del servicio:

```bash
curl http://localhost:3001/api/budget/bcn/availability
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "available": true,
    "status": 200,
    "message": "BCN service is available"
  }
}
```

### Testing

Probar la integración:

```bash
# Obtener datos de un año específico
curl http://localhost:3001/api/budget/bcn?year=2024

# Listar años disponibles
curl http://localhost:3001/api/budget/bcn/years

# Verificar que el endpoint principal use BCN
curl http://localhost:3001/api/budget?year=2024 | jq '.data.dataSource'
# Debería retornar: "BCN"
```

## Dependencias

### Backend
- `cheerio`: ^1.1.2 - Para parsear HTML
- `axios`: ^1.6.0 - Para hacer requests HTTP

### Instalación
```bash
npm install cheerio axios
```

## Limitaciones Conocidas

1. **Web Scraping**: 
   - Dependiente de la estructura HTML de BCN
   - Puede requerir actualizaciones si BCN cambia su sitio

2. **Rate Limiting**:
   - No hay rate limiting explícito en BCN
   - Usamos cache de 24h para ser respetuosos

3. **Datos Históricos**:
   - Algunos años antiguos pueden tener formatos diferentes
   - Se implementan fallbacks para estos casos

4. **Tiempo de Respuesta**:
   - Primera carga puede tomar 5-10 segundos
   - Cargas subsecuentes son instantáneas (cache)

## Mejoras Futuras

1. **API Oficial de BCN**:
   - Contactar a BCN para solicitar API oficial
   - Migrar de web scraping a API REST

2. **Datos en Tiempo Real**:
   - Implementar webhooks si BCN los ofrece
   - Actualización automática cuando hay cambios

3. **Análisis Avanzado**:
   - Comparaciones año a año automáticas
   - Detección de anomalías en ejecución
   - Alertas de modificaciones significativas

4. **Exportación de Datos**:
   - Descargar datos en CSV/Excel
   - Generar reportes PDF
   - API para integraciones externas

## Soporte y Contacto

Para reportar problemas con la integración BCN:
- GitHub Issues: [tu-repo]/issues
- Email: tu-email@ejemplo.com

## Referencias

- **BCN Presupuesto**: https://www.bcn.cl/presupuesto
- **DIPRES**: https://www.dipres.gob.cl
- **Datos Abiertos**: https://datos.gob.cl

## Changelog

### v1.0.0 (2024-10-06)
- ✅ Integración inicial con BCN
- ✅ Web scraping con Cheerio
- ✅ Cache de 24 horas
- ✅ Fallback a datos mock
- ✅ Transformación a formato estándar
- ✅ Rutas API completas
- ✅ Página frontend dedicada
- ✅ Documentación completa
