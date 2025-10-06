# Guía de Ajuste del Scraper BCN

## Estado Actual

La integración con BCN está **implementada y funcional**, pero requiere ajustes en los selectores HTML para extraer datos reales del sitio web de BCN.

**Estado actual del scraper:**
- ✅ Servicio BCN disponible y respondiendo
- ✅ Estructura de código completa
- ✅ Sistema de fallback funcionando
- ⚠️ Selectores HTML necesitan ajuste manual

## ¿Por qué se necesita ajuste manual?

El sitio web de BCN puede tener una estructura HTML específica que requiere inspección manual para identificar los selectores correctos. Esto es común en web scraping.

## Cómo Ajustar los Selectores

### Paso 1: Inspeccionar la Página de BCN

1. Abre en tu navegador: https://www.bcn.cl/presupuesto/periodo/2024
2. Abre las DevTools (F12 o clic derecho → Inspeccionar)
3. Busca la tabla de partidas presupuestarias
4. Identifica los selectores CSS correctos

### Paso 2: Actualizar el Código

Edita el archivo `src/services/bcnService.js`, específicamente el método `parseHtmlData()`:

```javascript
parseHtmlData($, year) {
  const partidas = [];
  
  // AJUSTAR ESTOS SELECTORES según la estructura real de BCN
  
  // Ejemplo de selectores a buscar:
  // - Tabla principal: 'table.budget-table' o '#presupuesto-table'
  // - Filas de datos: 'tbody tr' o 'tr.budget-row'
  // - Celdas: 'td' con clases específicas
  
  // Opción 1: Buscar por ID
  const mainTable = $('#tabla-presupuesto');
  
  // Opción 2: Buscar por clase
  const mainTable = $('.tabla-partidas');
  
  // Opción 3: Buscar por atributo
  const mainTable = $('table[data-type="budget"]');
  
  // Una vez identificada la tabla correcta, extraer los datos:
  mainTable.find('tbody tr').each((i, row) => {
    const $row = $(row);
    const cells = $row.find('td');
    
    // AJUSTAR ESTOS ÍNDICES según las columnas reales
    const partida = {
      numero: cells.eq(0).text().trim(),        // Columna 0: Número
      nombre: cells.eq(1).text().trim(),        // Columna 1: Nombre
      aprobado: this.parseAmount(cells.eq(2).text()),    // Columna 2: Aprobado
      modificaciones: this.parseAmount(cells.eq(3).text()), // Columna 3: Modificaciones
      vigente: this.parseAmount(cells.eq(4).text()),     // Columna 4: Vigente
      devengado: this.parseAmount(cells.eq(5).text()),   // Columna 5: Devengado
      porcentajeEjecucion: this.parsePercentage(cells.eq(6).text()) // Columna 6: %
    };
    
    partidas.push(partida);
  });
  
  // ... resto del código
}
```

### Paso 3: Ejemplos de Estructuras HTML Comunes

#### Estructura Tipo 1: Tabla Simple
```html
<table class="tabla-presupuesto">
  <thead>
    <tr>
      <th>Partida</th>
      <th>Institución</th>
      <th>Aprobado</th>
      <!-- ... -->
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>01</td>
      <td>Ministerio de Educación</td>
      <td>$15.400.000.000</td>
      <!-- ... -->
    </tr>
  </tbody>
</table>
```

**Selectores:**
```javascript
const mainTable = $('table.tabla-presupuesto');
mainTable.find('tbody tr').each((i, row) => {
  const cells = $(row).find('td');
  // ...
});
```

#### Estructura Tipo 2: Tabla con Divs
```html
<div class="presupuesto-container">
  <div class="partida-row">
    <div class="col-numero">01</div>
    <div class="col-nombre">Ministerio de Educación</div>
    <div class="col-monto">$15.400.000.000</div>
  </div>
</div>
```

**Selectores:**
```javascript
const rows = $('.partida-row');
rows.each((i, row) => {
  const $row = $(row);
  const partida = {
    numero: $row.find('.col-numero').text().trim(),
    nombre: $row.find('.col-nombre').text().trim(),
    aprobado: this.parseAmount($row.find('.col-monto').text())
  };
});
```

#### Estructura Tipo 3: Tabla Dinámica (JavaScript)
Si la tabla se carga dinámicamente con JavaScript, necesitarás usar Puppeteer:

```javascript
// Instalar: npm install puppeteer
const puppeteer = require('puppeteer');

async getBudgetData(year) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${this.baseUrl}/periodo/${year}`);
  
  // Esperar a que la tabla se cargue
  await page.waitForSelector('table.presupuesto');
  
  // Extraer el HTML
  const html = await page.content();
  const $ = cheerio.load(html);
  
  // Ahora puedes usar los selectores normalmente
  const mainTable = $('table.presupuesto');
  // ...
  
  await browser.close();
}
```

### Paso 4: Probar los Cambios

Después de ajustar los selectores, ejecuta el script de prueba:

```bash
node test-bcn-integration.js
```

Si ves este mensaje, ¡funcionó!:
```
✓ Datos obtenidos exitosamente
✓ Datos reales: Sí
✓ Número de partidas: 25
```

### Paso 5: Debugging

Si aún no funciona, agrega logs para ver qué está encontrando:

```javascript
parseHtmlData($, year) {
  console.log('🔍 Debugging HTML structure...');
  
  // Ver todas las tablas
  const tables = $('table');
  console.log(`Found ${tables.length} tables`);
  
  tables.each((i, table) => {
    const $table = $(table);
    console.log(`Table ${i}:`);
    console.log(`  - ID: ${$table.attr('id')}`);
    console.log(`  - Class: ${$table.attr('class')}`);
    console.log(`  - Rows: ${$table.find('tr').length}`);
    
    // Ver encabezados
    const headers = $table.find('th, thead td');
    console.log(`  - Headers: ${headers.map((i, el) => $(el).text().trim()).get().join(', ')}`);
  });
  
  // Ver primeras filas
  const firstRows = $('tr').slice(0, 5);
  console.log('\nFirst 5 rows:');
  firstRows.each((i, row) => {
    const cells = $(row).find('td, th');
    console.log(`Row ${i}: ${cells.map((i, el) => $(el).text().trim()).get().join(' | ')}`);
  });
  
  // ... resto del código
}
```

## Alternativa: Usar la API de DIPRES

Si el scraping de BCN resulta muy complejo, considera usar la API de DIPRES como fuente principal:

```javascript
// En apiService.js
async getRealBudgetData(year) {
  try {
    // 1. Intentar DIPRES API primero
    const dipresUrl = `https://www.dipres.gob.cl/api/presupuesto/${year}`;
    const response = await this.axiosInstance.get(dipresUrl);
    
    if (response.data) {
      return this.transformDipresData(response.data, year);
    }
  } catch (error) {
    console.warn('DIPRES failed, trying BCN...');
    // Fallback a BCN
  }
  
  // 2. Intentar BCN
  // ...
}
```

## Recursos Útiles

- **Cheerio Docs**: https://cheerio.js.org/
- **CSS Selectors**: https://www.w3schools.com/cssref/css_selectors.asp
- **Puppeteer Docs**: https://pptr.dev/
- **BCN Presupuesto**: https://www.bcn.cl/presupuesto

## Contacto con BCN

Si necesitas ayuda, puedes contactar a BCN para solicitar:
1. Documentación de su estructura HTML
2. API oficial (si existe)
3. Permisos para scraping

**Contacto BCN:**
- Web: https://www.bcn.cl/contacto
- Email: consultas@bcn.cl

## Notas Importantes

1. **Respeta los términos de uso** del sitio web de BCN
2. **Usa cache** para minimizar requests (ya implementado: 24h)
3. **Implementa rate limiting** si haces múltiples requests
4. **Maneja errores gracefully** (ya implementado con fallbacks)
5. **Documenta los cambios** cuando ajustes los selectores

## Estado de Implementación

- [x] Estructura básica del servicio
- [x] Sistema de cache
- [x] Manejo de errores y fallbacks
- [x] Transformación de datos
- [x] Rutas API
- [x] Frontend completo
- [ ] **Selectores HTML ajustados** ← PENDIENTE (requiere inspección manual)
- [ ] Validación con datos reales

Una vez ajustados los selectores, la integración estará 100% funcional con datos reales de BCN.
