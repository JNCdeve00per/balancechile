const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Balance Chile API',
      version: '1.0.0',
      description: 'API para visualización del Presupuesto Público de Chile',
      contact: {
        name: 'Balance Chile Team',
        email: 'contact@balancechile.cl'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        BudgetData: {
          type: 'object',
          properties: {
            year: { type: 'integer', example: 2024 },
            totalBudget: { type: 'number', example: 48500000000000 },
            currency: { type: 'string', example: 'CLP' },
            ministries: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Ministerio de Educación' },
                  budget: { type: 'number', example: 8500000000000 },
                  percentage: { type: 'number', example: 17.5 }
                }
              }
            }
          }
        },
        EconomicData: {
          type: 'object',
          properties: {
            year: { type: 'integer', example: 2024 },
            gdp: { type: 'number', example: 280000000000 },
            growth: { type: 'number', example: 2.3 },
            currency: { type: 'string', example: 'USD' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerSpec,
  swaggerUi
};

