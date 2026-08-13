import { Router } from 'express';
import categoryController from '../controllers/Category.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.get('/', categoryController.getAll.bind(categoryController));
router.post('/', authMiddleware, adminMiddleware, categoryController.create.bind(categoryController));
router.put('/:id', authMiddleware, adminMiddleware, categoryController.update.bind(categoryController));
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.remove.bind(categoryController));
export default router;
