const express = require('express');
const router = express.Router();
const apiService = require('../services/apiService');

/**
 * @swagger
 * /api/ministry/{code}:
 *   get:
 *     summary: Obtiene datos detallados de un ministerio específico
 *     tags: [Ministry]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del ministerio (ej. MINEDUC, MINSAL)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Año del presupuesto
 *     responses:
 *       200:
 *         description: Datos del ministerio obtenidos exitosamente
 *       404:
 *         description: Ministerio no encontrado
 */
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const year = parseInt(req.query.year) || 2024;
    
    const data = await apiService.getMinistryData(code.toUpperCase(), year);
    
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ministry route error:', error);
    
    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: 'Ministry not found',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error fetching ministry data',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
});

/**
 * @swagger
 * /api/ministry:
 *   get:
 *     summary: Obtiene lista de todos los ministerios disponibles
 *     tags: [Ministry]
 *     responses:
 *       200:
 *         description: Lista de ministerios obtenida exitosamente
 */
router.get('/', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || 2024;
    const budgetData = await apiService.getBudgetData(year);
    
    const ministries = budgetData.ministries.map(ministry => ({
      code: ministry.code,
      name: ministry.name,
      budget: ministry.budget,
      percentage: ministry.percentage
    }));
    
    res.json({
      success: true,
      data: {
        year,
        ministries,
        count: ministries.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ministry list route error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching ministries list',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

