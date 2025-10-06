const axios = require('axios');
const cheerio = require('cheerio');
const cacheService = require('./cacheService');

/**
 * Servicio para integrar datos de la Biblioteca del Congreso Nacional (BCN)
 * Fuente: https://www.bcn.cl/presupuesto/periodo/[año]
 */
class BcnService {
  constructor() {
    this.baseUrl = 'https://www.bcn.cl/presupuesto';
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Años disponibles en BCN (desde 2010 hasta el año actual + 1)
    this.availableYears = this.generateAvailableYears();
  }

  generateAvailableYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2010; year <= currentYear + 1; year++) {
      years.push(year);
    }
    return years;
  }

  /**
   * Obtiene los datos de presupuesto desde BCN para un año específico
   * @param {number} year - Año del presupuesto
   * @returns {Promise<Object>} - Datos del presupuesto
   */
  async getBudgetData(year) {
    const cacheKey = `bcn_budget_${year}`;
    
    try {
      // Intentar obtener desde cache primero
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        console.log(`BCN Cache hit for year ${year}`);
        return cached;
      }

      console.log(`Fetching BCN data for year ${year}...`);
      
      // Verificar que el año esté disponible
      if (!this.availableYears.includes(year)) {
        throw new Error(`Year ${year} not available in BCN database`);
      }

      const url = `${this.baseUrl}/periodo/${year}`;
      const response = await this.axiosInstance.get(url);
      
      if (response.status !== 200) {
        throw new Error(`BCN returned status ${response.status}`);
      }

      // Parsear el HTML con cheerio
      const $ = cheerio.load(response.data);
      
      // Extraer datos de la página
      const budgetData = await this.parseHtmlData($, year);
      
      // Validar que tengamos datos
      if (!budgetData || !budgetData.partidas || budgetData.partidas.length === 0) {
        throw new Error('No budget data found in BCN page');
      }

      // Cachear los datos por 24 horas (86400 segundos)
      await cacheService.set(cacheKey, budgetData, 86400);
      
      return budgetData;
      
    } catch (error) {
      console.error(`Error fetching BCN data for year ${year}:`, error.message);
      
      // Intentar obtener datos stale del cache
      const staleData = await cacheService.get(`stale_${cacheKey}`);
      if (staleData) {
        console.log(`Returning stale BCN data for year ${year}`);
        return staleData;
      }
      
      throw error;
    }
  }

  /**
   * Parsea el HTML de BCN y extrae los datos de presupuesto
   * @param {CheerioAPI} $ - Instancia de cheerio
   * @param {number} year - Año del presupuesto
   * @returns {Object} - Datos estructurados del presupuesto
   */
  parseHtmlData($, year) {
    const partidas = [];
    let totalAprobado = 0;
    let totalModificaciones = 0;
    let totalVigente = 0;
    let totalDevengado = 0;

    try {
      // Buscar la tabla de partidas presupuestarias
      // La estructura puede variar, así que intentamos múltiples selectores
      const tables = $('table');
      
      if (tables.length === 0) {
        console.warn('No tables found in BCN page');
        return this.getFallbackData(year);
      }

      // Buscar la tabla principal de presupuesto
      let mainTable = null;
      tables.each((i, table) => {
        const $table = $(table);
        const headers = $table.find('th, thead td');
        const headerText = headers.text().toLowerCase();
        
        // Buscar tabla que contenga columnas relevantes
        if (headerText.includes('partida') || 
            headerText.includes('institución') || 
            headerText.includes('aprobado') ||
            headerText.includes('vigente')) {
          mainTable = $table;
          return false; // break
        }
      });

      if (!mainTable) {
        console.warn('Main budget table not found in BCN page');
        return this.getFallbackData(year);
      }

      // Extraer encabezados
      const headers = [];
      mainTable.find('thead tr').first().find('th, td').each((i, el) => {
        headers.push($(el).text().trim());
      });

      console.log('BCN Table headers:', headers);

      // Extraer filas de datos
      mainTable.find('tbody tr').each((i, row) => {
        const $row = $(row);
        const cells = $row.find('td');
        
        if (cells.length < 3) return; // Skip invalid rows

        const partida = {
          numero: this.cleanText(cells.eq(0).text()),
          nombre: this.cleanText(cells.eq(1).text()),
          aprobado: this.parseAmount(cells.eq(2).text()),
          modificaciones: cells.length > 3 ? this.parseAmount(cells.eq(3).text()) : 0,
          vigente: cells.length > 4 ? this.parseAmount(cells.eq(4).text()) : 0,
          devengado: cells.length > 5 ? this.parseAmount(cells.eq(5).text()) : 0,
          porcentajeEjecucion: cells.length > 6 ? this.parsePercentage(cells.eq(6).text()) : 0
        };

        // Solo agregar si tiene datos válidos
        if (partida.nombre && (partida.aprobado > 0 || partida.vigente > 0)) {
          partidas.push(partida);
          totalAprobado += partida.aprobado;
          totalModificaciones += partida.modificaciones;
          totalVigente += partida.vigente;
          totalDevengado += partida.devengado;
        }
      });

      // Si no encontramos partidas, usar datos de fallback
      if (partidas.length === 0) {
        console.warn('No partidas found, using fallback data');
        return this.getFallbackData(year);
      }

      console.log(`Successfully parsed ${partidas.length} partidas from BCN for year ${year}`);

      return {
        year,
        source: 'BCN - Biblioteca del Congreso Nacional',
        sourceUrl: `${this.baseUrl}/periodo/${year}`,
        lastUpdated: new Date().toISOString(),
        isRealData: true,
        totales: {
          aprobado: totalAprobado,
          modificaciones: totalModificaciones,
          vigente: totalVigente,
          devengado: totalDevengado,
          porcentajeEjecucion: totalVigente > 0 ? (totalDevengado / totalVigente) * 100 : 0
        },
        partidas,
        partidasCount: partidas.length
      };

    } catch (error) {
      console.error('Error parsing BCN HTML:', error.message);
      return this.getFallbackData(year);
    }
  }

  /**
   * Limpia texto extraído del HTML
   */
  cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Parsea montos desde texto (ej: "$1.234.567" o "1,234,567")
   */
  parseAmount(text) {
    if (!text) return 0;
    
    // Remover símbolos de moneda y espacios
    const cleaned = text.replace(/[$\s]/g, '');
    
    // Detectar formato (punto como separador de miles o coma)
    let number = 0;
    
    if (cleaned.includes('.') && cleaned.includes(',')) {
      // Formato europeo: 1.234.567,89
      number = parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
    } else if (cleaned.includes('.')) {
      // Formato chileno: 1.234.567 (punto como separador de miles)
      number = parseFloat(cleaned.replace(/\./g, ''));
    } else if (cleaned.includes(',')) {
      // Formato US: 1,234,567
      number = parseFloat(cleaned.replace(/,/g, ''));
    } else {
      number = parseFloat(cleaned);
    }
    
    return isNaN(number) ? 0 : Math.round(number * 1000); // Convertir a miles de pesos
  }

  /**
   * Parsea porcentajes desde texto (ej: "85.5%" o "85,5")
   */
  parsePercentage(text) {
    if (!text) return 0;
    
    const cleaned = text.replace(/[%\s]/g, '').replace(',', '.');
    const number = parseFloat(cleaned);
    
    return isNaN(number) ? 0 : number;
  }

  /**
   * Datos de fallback cuando no se pueden obtener datos reales de BCN
   */
  getFallbackData(year) {
    console.log(`Using fallback data for BCN year ${year}`);
    
    return {
      year,
      source: 'BCN - Biblioteca del Congreso Nacional (Fallback)',
      sourceUrl: `${this.baseUrl}/periodo/${year}`,
      lastUpdated: new Date().toISOString(),
      isRealData: false,
      isFallback: true,
      note: 'Datos no disponibles desde BCN. Se requiere verificación manual.',
      totales: {
        aprobado: 0,
        modificaciones: 0,
        vigente: 0,
        devengado: 0,
        porcentajeEjecucion: 0
      },
      partidas: [],
      partidasCount: 0
    };
  }

  /**
   * Obtiene lista de todos los años disponibles en BCN
   */
  getAvailableYears() {
    return this.availableYears;
  }

  /**
   * Transforma datos de BCN al formato estándar de la aplicación
   */
  transformToStandardFormat(bcnData) {
    if (!bcnData || bcnData.isFallback) {
      return null;
    }

    // Agrupar partidas por ministerio/institución
    const ministriesByCode = {};
    
    bcnData.partidas.forEach(partida => {
      const code = this.extractMinistryCode(partida.nombre);
      
      if (!ministriesByCode[code]) {
        ministriesByCode[code] = {
          code,
          name: this.extractMinistryName(partida.nombre),
          budget: 0,
          approved: 0,
          modifications: 0,
          current: 0,
          executed: 0,
          executionPercentage: 0,
          partidas: []
        };
      }
      
      ministriesByCode[code].budget += partida.vigente;
      ministriesByCode[code].approved += partida.aprobado;
      ministriesByCode[code].modifications += partida.modificaciones;
      ministriesByCode[code].current += partida.vigente;
      ministriesByCode[code].executed += partida.devengado;
      ministriesByCode[code].partidas.push(partida);
    });

    // Calcular porcentajes de ejecución
    Object.values(ministriesByCode).forEach(ministry => {
      if (ministry.current > 0) {
        ministry.executionPercentage = (ministry.executed / ministry.current) * 100;
      }
      ministry.percentage = (ministry.budget / bcnData.totales.vigente) * 100;
    });

    const ministries = Object.values(ministriesByCode).sort((a, b) => b.budget - a.budget);

    return {
      year: bcnData.year,
      totalBudget: bcnData.totales.vigente,
      totalApproved: bcnData.totales.aprobado,
      totalModifications: bcnData.totales.modificaciones,
      totalExecuted: bcnData.totales.devengado,
      executionPercentage: bcnData.totales.porcentajeEjecucion,
      currency: 'CLP',
      lastUpdated: bcnData.lastUpdated,
      source: bcnData.source,
      sourceUrl: bcnData.sourceUrl,
      isRealData: bcnData.isRealData,
      ministries,
      ministriesCount: ministries.length,
      partidasCount: bcnData.partidasCount
    };
  }

  /**
   * Extrae código de ministerio desde el nombre de la partida
   */
  extractMinistryCode(partidaName) {
    const name = partidaName.toUpperCase();
    
    // Mapeo de palabras clave a códigos de ministerio
    const mappings = {
      'EDUCACIÓN': 'MINEDUC',
      'EDUCACION': 'MINEDUC',
      'SALUD': 'MINSAL',
      'INTERIOR': 'INTERIOR',
      'DESARROLLO SOCIAL': 'MDS',
      'DEFENSA': 'DEFENSA',
      'OBRAS PÚBLICAS': 'MOP',
      'JUSTICIA': 'JUSTICIA',
      'TRABAJO': 'TRABAJO',
      'HACIENDA': 'HACIENDA',
      'RELACIONES EXTERIORES': 'RREE',
      'ECONOMÍA': 'ECONOMIA',
      'ECONOMIA': 'ECONOMIA',
      'AGRICULTURA': 'AGRICULTURA',
      'MINERÍA': 'MINERIA',
      'MINERIA': 'MINERIA',
      'TRANSPORTES': 'MTT',
      'VIVIENDA': 'MINVU',
      'MEDIO AMBIENTE': 'MMA',
      'ENERGÍA': 'ENERGIA',
      'ENERGIA': 'ENERGIA',
      'CULTURAS': 'CULTURAS',
      'CIENCIA': 'CIENCIA',
      'BIENES NACIONALES': 'BIENES',
      'MUJER': 'MUJER',
      'DEPORTE': 'DEPORTE',
      'PRESIDENCIA': 'SEGPRES',
      'GOBIERNO': 'SEGGOB'
    };

    for (const [keyword, code] of Object.entries(mappings)) {
      if (name.includes(keyword)) {
        return code;
      }
    }

    return 'OTROS';
  }

  /**
   * Extrae nombre limpio de ministerio desde el nombre de la partida
   */
  extractMinistryName(partidaName) {
    // Intentar extraer el nombre del ministerio
    const patterns = [
      /Ministerio\s+de\s+([^,\-]+)/i,
      /Ministerio\s+del?\s+([^,\-]+)/i,
      /Secretaría\s+General\s+de\s+([^,\-]+)/i
    ];

    for (const pattern of patterns) {
      const match = partidaName.match(pattern);
      if (match) {
        return `Ministerio de ${match[1].trim()}`;
      }
    }

    // Si no se encuentra patrón, retornar el nombre de la partida limpio
    return partidaName.split('-')[0].trim();
  }

  /**
   * Verifica la disponibilidad del servicio BCN
   */
  async checkAvailability() {
    try {
      const response = await this.axiosInstance.get(this.baseUrl, {
        timeout: 5000
      });
      
      return {
        available: response.status === 200,
        status: response.status,
        message: 'BCN service is available'
      };
    } catch (error) {
      return {
        available: false,
        status: error.response?.status || 0,
        message: error.message
      };
    }
  }
}

module.exports = new BcnService();
