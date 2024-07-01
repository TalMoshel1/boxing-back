import express from 'express';
import { signIn, registration, forgotPasswordPhone, resetPasswordPhone } from '../controllers/auth.js';
import { authenticateToken } from '../middlewares/auth.js';
const router = express.Router();
router.post('/signin', signIn);
router.post('/register', registration);
router.put('/forgot-password-phone', forgotPasswordPhone);
router.post('/reset-password-phone', authenticateToken, resetPasswordPhone);
export default router;