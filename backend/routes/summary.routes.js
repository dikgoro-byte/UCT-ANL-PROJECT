import express from 'express';
import { 
  generateSummary,
  getLatestSummary
} from '../controllers/summary.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- Public Route (for visitors to read the summary) ---
router.get('/latest', getLatestSummary);

// --- Admin Route (for the "Generate" button) ---
router.post('/generate', protect, admin, generateSummary);

export default router;