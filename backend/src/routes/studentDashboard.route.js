import { Router } from 'express';
import { 
  getStudentDashboard, 
  uploadAchievement, 
  updateStudentProfile 
} from '../controllers/studentDashboard.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Student dashboard routes
router.route('/:id/dashboard').get(getStudentDashboard);
router.route('/:id/upload').post(uploadAchievement);
router.route('/:id/profile').put(updateStudentProfile);

export default router;
