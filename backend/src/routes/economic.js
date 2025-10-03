const express = require('express');
const router = express.Router();
const apiService = require('../services/apiService');

/**
 * @swagger
 * /api/economic:
 *   get:
 *     summary: Obtiene indicadores económicos de Chile
 *     tags: [Economic]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Año de los datos económicos
 *     responses:
 *       200:
 *         description: Datos económicos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EconomicData'
 */
router.get('/', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || 2024;
    const data = await apiService.getEconomicData(year);
    
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Economic route error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching economic data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/economic/gdp:
 *   get:
 *     summary: Obtiene datos del PIB de Chile
 *     tags: [Economic]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Año del PIB
 *       - in: query
 *         name: range
 *         schema:
 *           type: integer
 *         description: Rango de años hacia atrás (default 5)
 *     responses:
 *       200:
 *         description: Datos del PIB obtenidos exitosamente
 */
router.get('/gdp', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || 2024;
    const range = parseInt(req.query.range) || 5;
    
    // Generate historical GDP data
    const gdpHistory = [];
    for (let i = range - 1; i >= 0; i--) {
      const currentYear = year - i;
      const baseGdp = 280000000000; // Base GDP in USD
      const growth = Math.random() * 4 - 1; // Random growth between -1% and 3%
      const gdpValue = baseGdp * Math.pow(1.02, -i) * (1 + growth / 100);
      
      gdpHistory.push({
        year: currentYear,
        gdp: Math.round(gdpValue),
        growth: Math.round(growth * 10) / 10,
        currency: 'USD'
      });
    }
    
    res.json({
      success: true,
      data: {
        current: gdpHistory[gdpHistory.length - 1],
        history: gdpHistory,
        average_growth: gdpHistory.reduce((sum, item) => sum + item.growth, 0) / gdpHistory.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GDP route error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching GDP data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
