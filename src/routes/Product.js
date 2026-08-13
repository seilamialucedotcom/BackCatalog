import { Router } from 'express';
import productController from '../controllers/Product.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.get('/', productController.getAll.bind(productController));
router.post('/', authMiddleware, adminMiddleware, productController.create.bind(productController));
router.put('/:id', authMiddleware, adminMiddleware, productController.update.bind(productController));
router.delete('/:id', authMiddleware, adminMiddleware, productController.remove.bind(productController));
export default router;
