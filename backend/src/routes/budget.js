const express = require('express');
const router = express.Router();
const apiService = require('../services/apiService');

/**
 * @swagger
 * /api/budget:
 *   get:
 *     summary: Obtiene datos del presupuesto nacional
 *     tags: [Budget]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Año del presupuesto (default 2024)
 *     responses:
 *       200:
 *         description: Datos del presupuesto obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BudgetData'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || 2024;
    const data = await apiService.getBudgetData(year);
    
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Budget route error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching budget data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/budget/ministries:
 *   get:
 *     summary: Obtiene lista de ministerios con sus presupuestos
 *     tags: [Budget]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Año del presupuesto
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, budget, percentage]
 *         description: Campo por el cual ordenar
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Orden ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista de ministerios obtenida exitosamente
 */
router.get('/ministries', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || 2024;
    const sortField = req.query.sort || 'budget';
    const sortOrder = req.query.order || 'desc';
    
    const budgetData = await apiService.getBudgetData(year);
    let ministries = [...budgetData.ministries];
    
    // Sort ministries
    ministries.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    res.json({
      success: true,
      data: {
        year,
        totalBudget: budgetData.totalBudget,
        ministries,
        count: ministries.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ministries route error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching ministries data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/budget/expenses:
 *   get:
 *     summary: Obtiene distribución de gastos (sueldos vs programas)
 *     tags: [Budget]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Año del presupuesto
 *     responses:
 *       200:
 *         description: Distribución de gastos obtenida exitosamente
 */
router.get('/expenses', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || 2024;
    const budgetData = await apiService.getBudgetData(year);
    
    res.json({
      success: true,
      data: {
        year,
        totalBudget: budgetData.totalBudget,
        expenses: budgetData.expenses
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Expenses route error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching expenses data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/budget/agriculture-details:
 *   get:
 *     summary: Obtiene datos detallados del Ministerio de Agricultura basados en fuentes oficiales
 *     tags: [Budget]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Año del presupuesto (default 2024)
 *     responses:
 *       200:
 *         description: Datos detallados del Ministerio de Agricultura
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalBudget:
 *                       type: number
 *                     percentageOfNational:
 *                       type: number
 *                     growth:
 *                       type: number
 *                     source:
 *                       type: string
 *                     sourceUrl:
 *                       type: string
 *                     services:
 *                       type: array
 *                     keyInsights:
 *                       type: array
 *       500:
 *         description: Error interno del servidor
 */
router.get('/agriculture-details', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || 2024;
    const data = apiService.getAgricultureMinistryDetails(year);
    
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      note: 'Datos basados en análisis oficial de la Universidad San Sebastián'
    });
  } catch (error) {
    console.error('Agriculture details route error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching agriculture details',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/budget/data-sources:
 *   get:
 *     summary: Obtiene información sobre las fuentes oficiales de datos presupuestarios
 *     tags: [Budget]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Año para validar fuentes (opcional)
 *     responses:
 *       200:
 *         description: Información de fuentes oficiales y validación de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     officialSources:
 *                       type: object
 *                     validation:
 *                       type: object
 *                     recommendations:
 *                       type: array
 *       500:
 *         description: Error interno del servidor
 */
router.get('/data-sources', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year) : null;
    
    const officialSources = {
      2024: [
        {
          name: 'BCN',
          url: 'https://www.bcn.cl/presupuesto/periodo/2024',
          priority: 1,
          description: 'Biblioteca del Congreso Nacional - Datos oficiales 2024',
          status: 'available'
        },
        {
          name: 'USS Analysis',
          url: 'https://politicaspublicas.uss.cl/wp-content/uploads/2023/10/231022-USS_Revision-Presupuesto-MINAGRI_21hrs.pdf',
          priority: 2,
          description: 'Análisis Universidad San Sebastián - MINAGRI 2024',
          status: 'integrated',
          data: {
            totalBudget: 76918639000000,
            agricultureBudget: 827045000000,
            agriculturePercentage: 1.0
          }
        }
      ],
      2023: [
        {
          name: 'DIPRES',
          url: 'https://www.dipres.gob.cl/597/articles-285602_doc_pdf.pdf',
          priority: 1,
          description: 'DIPRES - Proyecto de Ley de Presupuestos 2023',
          status: 'integrated',
          data: {
            totalBudget: 70800000000000,
            usdEquivalent: 81580000000,
            methodology: 'Balance Cíclicamente Ajustado (BCA)',
            bcaTarget: -2.1
          }
        },
        {
          name: 'BCN',
          url: 'https://www.bcn.cl/presupuesto/periodo/2023',
          priority: 2,
          description: 'Biblioteca del Congreso Nacional - Datos oficiales 2023',
          status: 'available'
        }
      ],
      2022: [
        {
          name: 'DIPRES',
          url: 'https://www.dipres.gob.cl/api/2022',
          priority: 1,
          description: 'DIPRES - Datos Oficiales API 2022',
          status: 'integrated',
          data: {
            totalBudget: 64000000000000
          }
        },
        {
          name: 'BCN',
          url: 'https://www.bcn.cl/presupuesto/periodo/2022',
          priority: 2,
          description: 'Biblioteca del Congreso Nacional - Datos oficiales 2022',
          status: 'available'
        }
      ],
      2021: [
        {
          name: 'DIPRES',
          url: 'https://www.dipres.gob.cl/597/w3-multipropertyvalues-15145-25771.html',
          priority: 1,
          description: 'DIPRES - Ley de Presupuestos 2021 (XML/CSV)',
          status: 'integrated',
          data: {
            totalBudget: 60000000000000
          }
        }
      ],
      2020: [
        {
          name: 'DIPRES',
          url: 'https://www.dipres.gob.cl/597/w3-multipropertyvalues-14145-25771.html',
          priority: 1,
          description: 'DIPRES - Ley de Presupuestos 2020 (incluye medidas COVID-19)',
          status: 'integrated',
          data: {
            totalBudget: 58000000000000
          }
        }
      ]
    };

    let validation = null;
    if (year) {
      const sources = officialSources[year] || [];
      validation = {
        year,
        sourcesAvailable: sources.length,
        integratedSources: sources.filter(s => s.status === 'integrated').length,
        pendingSources: sources.filter(s => s.status === 'available').length,
        recommendations: []
      };

      if (sources.length === 0) {
        validation.recommendations.push(`No hay fuentes oficiales configuradas para el año ${year}`);
      } else {
        validation.recommendations.push(`Se encontraron ${sources.length} fuentes oficiales para ${year}`);
        
        const integrated = sources.filter(s => s.status === 'integrated');
        const pending = sources.filter(s => s.status === 'available');
        
        if (integrated.length > 0) {
          validation.recommendations.push(`${integrated.length} fuente(s) ya integrada(s): ${integrated.map(s => s.name).join(', ')}`);
        }
        
        if (pending.length > 0) {
          validation.recommendations.push(`${pending.length} fuente(s) pendiente(s) de integración: ${pending.map(s => s.name).join(', ')}`);
        }
      }
    }

    res.json({
      success: true,
      data: {
        officialSources,
        validation,
        currentStatus: {
          usingMockData: false,
          integratedSources: ['USS Analysis (MINAGRI 2024)', 'DIPRES (2023)', 'DIPRES (2022)', 'DIPRES (2021)', 'DIPRES (2020)'],
          pendingIntegration: ['BCN 2024', 'BCN 2023', 'BCN 2022'],
          note: 'La aplicación usa datos oficiales de DIPRES para 2020-2023 y análisis USS para MINAGRI 2024'
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Data sources route error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching data sources information',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

