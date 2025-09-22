import { Router } from 'express';
import { generatePortfolioPDF } from '../controllers/portfolio.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Route to download student portfolio PDF
router.route('/download/:studentId').get(verifyJWT, generatePortfolioPDF);

export default router;
