import express from 'express';
import { 
  simulateTournament, 
  getAllMatches
} from '../controllers/match.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- Public Route ---
router.get('/', getAllMatches);

// --- Protected Admin Route ---
router.post('/simulate-tournament', protect, admin, simulateTournament);

export default router;