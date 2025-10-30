import Team from '../models/team.model.js';
import User from '../models/user.model.js';
import { generateSquad, calculateTeamRating } from '../helpers/rating-generator.js';

/**
 * @desc    Register a new team (REPRESENTATIVE ONLY)
 * @route   POST /api/teams
 */
export const registerTeam = async (req, res) => {
  const { country, manager } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.teamId) {
      return res.status(400).json({ message: 'You have already registered a team' });
    }

    const teamExists = await Team.findOne({ country });
    if (teamExists) {
      return res.status(400).json({ message: 'A team from this country is already registered' });
    }
    
    const squad = generateSquad();
    const rating = calculateTeamRating(squad);

    const team = new Team({
      country,
      manager,
      representative: req.user.id,
      squad,
      rating
    });
    const createdTeam = await team.save();

    user.teamId = createdTeam._id;
    await user.save();

    res.status(201).json(createdTeam);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all registered teams (PUBLIC)
 * @route   GET /api/teams
 */
export const getAllTeams = async (req, res) => {
  try {
    // Population of the 'name' and 'email' of the representative
    const teams = await Team.find({})
      .sort({ createdAt: 1 })
      .populate('representative', 'name email'); // <-- THIS IS NEW
      
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};