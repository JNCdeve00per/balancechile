require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const budgetRoutes = require('./routes/budget');
const economicRoutes = require('./routes/economic');
const ministryRoutes = require('./routes/ministry');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { swaggerSpec, swaggerUi } = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Security middleware - Configuración especial para servir React
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar CSP para permitir inline scripts de React
  crossOriginEmbedderPolicy: false
}));

// CORS solo necesario en desarrollo cuando frontend corre en puerto diferente
if (!isProduction) {
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/budget', budgetRoutes);
app.use('/api/economic', economicRoutes);
app.use('/api/ministry', ministryRoutes);

// Servir archivos estáticos de React en producción
if (isProduction) {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));
  
  // Todas las rutas no-API deben servir el index.html de React
  app.get('*', (req, res, next) => {
    // Si es una ruta de API, continuar al siguiente handler
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/api-docs')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // En desarrollo, mostrar info de la API en la raíz
  app.get('/', (req, res) => {
    res.json({
      message: 'Balance Chile API - Development Mode',
      version: '1.0.0',
      docs: '/api-docs',
      health: '/health',
      note: 'Run frontend separately with: npm run dev:frontend'
    });
  });
}

// Error handling middleware
app.use(errorHandler);

// 404 handler para rutas de API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Solo hacer listen si NO estamos en Passenger/cPanel
if (typeof(PhusionPassenger) === 'undefined') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;

