import { Router } from 'express';
import brandController from '../controllers/Brand.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.get('/', brandController.getAll.bind(brandController));
router.post('/', authMiddleware, adminMiddleware, brandController.create.bind(brandController));

export default router;
