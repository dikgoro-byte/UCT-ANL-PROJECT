import mongoose from 'mongoose';
import { playerSchema } from './player.schema.js'; // <-- This is the new import

const teamSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    unique: true,
  },
  manager: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  representative: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // The array of 23 players, using the correct schema
  squad: [playerSchema], 
  
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;