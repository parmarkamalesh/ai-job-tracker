import { Router } from 'express';
import { body } from 'express-validator';
import { login, me, register } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty(),
  register
);

router.post('/login', body('email').isEmail().normalizeEmail(), body('password').notEmpty(), login);

router.get('/me', authMiddleware, me);

export default router;
