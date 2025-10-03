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

module.exports = router;

