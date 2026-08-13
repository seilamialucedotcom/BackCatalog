import { Router } from 'express';
import storeSettingsController from '../controllers/StoreSettings.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.get('/', storeSettingsController.getSettings.bind(storeSettingsController));
router.get('/catalog', storeSettingsController.getCatalog.bind(storeSettingsController));
router.put('/', authMiddleware, adminMiddleware, storeSettingsController.update.bind(storeSettingsController));
export default router;
