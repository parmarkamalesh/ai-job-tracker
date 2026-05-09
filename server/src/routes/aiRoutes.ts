import { Router } from 'express';
import { scoreResume, skillSuggestions } from '../controllers/aiController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/resume-score', scoreResume);
router.post('/skill-suggestions', skillSuggestions);

export default router;
