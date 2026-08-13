import express from 'express';
import cors from 'cors';

import './src/models/models.js';
import categoryRoutes from './src/routes/Category.js';
import productRoutes from './src/routes/Product.js';
import storeSettingsRoutes from './src/routes/StoreSettings.js';
import subcategoryRoutes from './src/routes/Subcategory.js';
import userRoutes from './src/routes/User.js';
import storeSettingsController from './src/controllers/StoreSettings.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
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
