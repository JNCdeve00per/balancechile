# Guía de Integración con APIs Oficiales

## 🎯 Objetivo

Este documento explica cómo conectar Balance Chile con las APIs oficiales del gobierno de Chile para obtener datos reales del presupuesto público.

## 📊 Estado Actual

Actualmente la aplicación funciona con **datos de demostración** que simulan información real basada en fuentes oficiales. Los datos cambian dinámicamente según el año seleccionado.

### ✅ Funcionalidades Implementadas
- Sistema dinámico de datos por año (2020-2025)
- Variaciones realistas en presupuestos ministeriales
- Indicadores económicos históricos
- Cache inteligente para optimizar rendimiento
- Fallback automático a datos demo si las APIs fallan

## 🔌 APIs Oficiales Disponibles

### 1. DIPRES (Dirección de Presupuestos)
```bash
# Ejemplo de endpoint hipotético
GET https://www.dipres.gob.cl/api/v1/presupuesto/{year}
GET https://www.dipres.gob.cl/api/v1/ministerios/{year}
```

### 2. BCN (Biblioteca del Congreso Nacional)
```bash
# Ejemplo de endpoint hipotético  
GET https://www.bcn.cl/api/presupuesto/periodo/{year}
GET https://www.bcn.cl/api/presupuesto/ministerios/{year}
```

### 3. Datos Abiertos (datos.gob.cl)
```bash
# API real existente
GET https://datos.gob.cl/api/3/action/datastore_search
?resource_id=presupuesto-{year}
&limit=100
```

### 4. Banco Central de Chile
```bash
# Para indicadores económicos
GET https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx
?user={user}&pass={pass}&function=GetSeries&timeseries=F073.PIB.FLU.R.CLP&firstdate={year}-01-01&lastdate={year}-12-31
```

## 🛠️ Implementación

### Paso 1: Configurar Variables de Entorno

Agregar al archivo `backend/config.env`:

```env
# APIs Oficiales
DIPRES_API_KEY=tu_api_key_aqui
BCN_API_KEY=tu_api_key_aqui  
DATOS_GOV_API_KEY=tu_api_key_aqui
BANCO_CENTRAL_USER=tu_usuario
BANCO_CENTRAL_PASS=tu_password

# URLs Base
DIPRES_API_URL=https://www.dipres.gob.cl/api/v1
BCN_API_URL=https://www.bcn.cl/api
DATOS_GOV_API_URL=https://datos.gob.cl/api/3/action
BANCO_CENTRAL_API_URL=https://si3.bcentral.cl/SieteRestWS
```

### Paso 2: Implementar Conectores Reales

El archivo `backend/src/services/apiService.js` ya está preparado. Solo necesitas descomentar y completar el método `getRealBudgetData()`:

```javascript
async getRealBudgetData(year) {
  try {
    // 1. Intentar DIPRES primero
    try {
      const dipresUrl = `${process.env.DIPRES_API_URL}/presupuesto/${year}`;
      const response = await this.axiosInstance.get(dipresUrl, {
        headers: { 'Authorization': `Bearer ${process.env.DIPRES_API_KEY}` }
      });
      
      if (response.data) {
        return this.transformDipresData(response.data, year);
      }
    } catch (dipresError) {
      console.warn('DIPRES API failed:', dipresError.message);
    }

    // 2. Fallback a BCN
    try {
      const bcnUrl = `${process.env.BCN_API_URL}/presupuesto/periodo/${year}`;
      const response = await this.axiosInstance.get(bcnUrl, {
        headers: { 'X-API-Key': process.env.BCN_API_KEY }
      });
      
      if (response.data) {
        return this.transformBcnData(response.data, year);
      }
    } catch (bcnError) {
      console.warn('BCN API failed:', bcnError.message);
    }

    // 3. Fallback a Datos Abiertos
    try {
      const datosGovUrl = `${process.env.DATOS_GOV_API_URL}/datastore_search`;
      const response = await this.axiosInstance.get(datosGovUrl, {
        params: {
          resource_id: `presupuesto-${year}`,
          limit: 1000
        }
      });
      
      if (response.data?.result?.records) {
        return this.transformDatosGovData(response.data.result.records, year);
      }
    } catch (datosGovError) {
      console.warn('Datos.gob.cl API failed:', datosGovError.message);
    }

    // 4. Si todo falla, usar datos mock
    console.warn(`No real data available for ${year}, using mock data`);
    return this.getMockBudgetData(year);

  } catch (error) {
    console.error(`Error fetching real data for ${year}:`, error);
    return this.getMockBudgetData(year);
  }
}
```

### Paso 3: Transformadores de Datos

Agregar métodos para normalizar datos de diferentes fuentes:

```javascript
transformDipresData(rawData, year) {
  return {
    year,
    totalBudget: rawData.total_budget,
    currency: 'CLP',
    source: 'DIPRES',
    sourceUrl: `https://www.dipres.gob.cl/presupuesto/${year}`,
    isRealData: true,
    ministries: rawData.ministries.map(m => ({
      name: m.name,
      budget: m.budget,
      percentage: (m.budget / rawData.total_budget) * 100,
      code: m.code
    })),
    // ... resto de la transformación
  };
}

transformBcnData(rawData, year) {
  // Transformar datos de BCN al formato estándar
}

transformDatosGovData(records, year) {
  // Transformar datos de datos.gob.cl al formato estándar
}
```

## 🔄 Testing de APIs Reales

### Script de Prueba

Crear `backend/scripts/test-apis.js`:

```javascript
const apiService = require('../src/services/apiService');

async function testApis() {
  console.log('🧪 Testing API connections...\n');
  
  for (const year of [2025, 2024, 2023]) {
    console.log(`📅 Testing year ${year}:`);
    
    try {
      const data = await apiService.getBudgetData(year);
      console.log(`✅ Success: ${data.source}`);
      console.log(`💰 Budget: ${data.totalBudget.toLocaleString('es-CL')}`);
      console.log(`📊 Real data: ${data.isRealData ? 'Yes' : 'No (Demo)'}\n`);
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    }
  }
}

testApis();
```

Ejecutar con:
```bash
cd backend
node scripts/test-apis.js
```

## 📈 Monitoreo y Logs

### Configurar Logging Avanzado

```javascript
// backend/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/api-calls.log' }),
    new winston.transports.Console()
  ]
});

module.exports = logger;
```

### Métricas de APIs

```javascript
// Agregar al apiService.js
logApiCall(source, year, success, responseTime) {
  logger.info('API Call', {
    source,
    year,
    success,
    responseTime,
    timestamp: new Date().toISOString()
  });
}
```

## 🚨 Manejo de Errores

### Estrategia de Fallback

1. **API Principal** (DIPRES) → **API Secundaria** (BCN) → **Datos Abiertos** → **Datos Demo**
2. **Cache Inteligente**: Usar datos en cache si las APIs fallan
3. **Notificación al Usuario**: Indicar claramente el origen de los datos

### Rate Limiting

```javascript
// Implementar rate limiting para no saturar APIs oficiales
const rateLimit = require('express-slow-down');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 10, // Después de 10 requests
  delayMs: 500 // Delay de 500ms por request adicional
});

app.use('/api/', apiLimiter);
```

## 📋 Checklist de Implementación

### Preparación
- [ ] Obtener credenciales de APIs oficiales
- [ ] Configurar variables de entorno
- [ ] Implementar transformadores de datos
- [ ] Crear tests unitarios

### Desarrollo
- [ ] Implementar `getRealBudgetData()`
- [ ] Agregar manejo de errores robusto
- [ ] Configurar cache inteligente
- [ ] Implementar logging detallado

### Testing
- [ ] Probar con datos reales de cada API
- [ ] Verificar fallbacks funcionan correctamente
- [ ] Test de performance con cache
- [ ] Validar transformación de datos

### Producción
- [ ] Configurar monitoreo de APIs
- [ ] Implementar alertas por fallos
- [ ] Documentar endpoints utilizados
- [ ] Configurar backup de datos

## 🔗 Enlaces Útiles

- [DIPRES - Transparencia Presupuestaria](https://www.dipres.gob.cl/transparencia)
- [BCN - Datos Presupuestarios](https://www.bcn.cl/presupuesto)
- [Datos Abiertos Chile](https://datos.gob.cl/)
- [Banco Central - API Estadísticas](https://si3.bcentral.cl/)

## 📞 Contacto para APIs

Para obtener acceso a APIs oficiales:

- **DIPRES**: transparencia@dipres.gob.cl
- **BCN**: datos@bcn.cl  
- **Datos Abiertos**: datos@modernizacion.gob.cl
- **Banco Central**: estadisticas@bcentral.cl

---

**Nota**: Mientras se implementan las conexiones reales, la aplicación funciona perfectamente con datos de demostración realistas que cambian dinámicamente según el año seleccionado.

