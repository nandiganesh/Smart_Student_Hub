import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect notifications for authenticated users
router.use(verifyJWT);

// GET /api/v1/notifications - return notifications for the current user (placeholder)
router.get('/', async (req, res) => {
  try {
    // Placeholder empty list; integrate with real notifications later
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
