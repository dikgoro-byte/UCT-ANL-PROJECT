import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 */
export const signup = async (req, res) => {
  // --- 1. GET 'name' FROM req.body ---
  const { name, email, password, role } = req.body;
  try {
    // Check for all fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide name, email, password, and role' });
    }
    
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // --- 2. CREATE USER WITH 'name' ---
    const user = await User.create({ name, email, password, role });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name, // <-- 3. RETURN 'name'
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name, // <-- 4. RETURN 'name'
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        token: generateToken(user._id, user.role),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    // This populates the 'team' field with the full team object
    const user = await User.findById(req.user.id).select('-password').populate('teamId', 'country manager rating squad');
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name, // <-- 5. RETURN 'name'
        email: user.email,
        role: user.role,
        team: user.teamId // This will be the populated team object or null
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};