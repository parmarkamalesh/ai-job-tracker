import { Router } from 'express';
import {
  createJob,
  deleteJob,
  getJob,
  listJobs,
  stats,
  updateJob,
} from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', listJobs);
router.get('/stats', stats);
router.get('/:id', getJob);
router.post('/', createJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
