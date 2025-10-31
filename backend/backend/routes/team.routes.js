import express from 'express';
import { registerTeam, getAllTeams } from '../controllers/team.controller.js';
import { protect, representative } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/teams
// @desc    Registers a new team
// @access  Protected view (Representative only)
router.post('/', protect, representative, registerTeam);

// @route   GET /api/teams
// @desc    Gets all registered teams
// @access  Public
router.get('/', getAllTeams);

export default router;