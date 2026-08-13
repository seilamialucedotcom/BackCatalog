import { Router } from 'express';
import userController from '../controllers/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.get('/me', authMiddleware, userController.me.bind(userController));
export default router;
