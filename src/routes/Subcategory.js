import { Router } from 'express';
import subcategoryController from '../controllers/Subcategory.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.post('/', authMiddleware, adminMiddleware, subcategoryController.create.bind(subcategoryController));
router.delete('/:id', authMiddleware, adminMiddleware, subcategoryController.remove.bind(subcategoryController));
export default router;
