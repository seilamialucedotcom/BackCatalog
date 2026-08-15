import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import './src/models/models.js';
import categoryRoutes from './src/routes/Category.js';
import productRoutes from './src/routes/Product.js';
import storeSettingsRoutes from './src/routes/StoreSettings.js';
import subcategoryRoutes from './src/routes/Subcategory.js';
import userRoutes from './src/routes/User.js';
import storeSettingsController from './src/controllers/StoreSettings.js';

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        formAction: ["'self'"], 
        frameAncestors: ["'none'"], 
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const allowedOrigins = [
  'https://catalog-nonho.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Bloqueado por CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/catalog', storeSettingsController.getCatalog.bind(storeSettingsController));
app.use('/api/settings', storeSettingsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', userRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Ruta no encontrada.' }));

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || (error.name === 'SequelizeValidationError' ? 400 : error.name === 'SequelizeUniqueConstraintError' ? 409 : 500);
  res.status(status).json({ message: error.message || 'Ha ocurrido un error en el servidor.' });
});

export default app;
