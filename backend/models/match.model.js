import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  round: {
    type: String,
    enum: ['quarter-final', 'semi-final', 'final'],
    required: true,
  },
  matchNumber: { 
    type: Number,
    required: true 
  },
  teamA: {
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    score: { type: Number, default: 0 }
  },
  teamB: {
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    score: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'simulated', 'played'],
    default: 'pending',
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  scorers: [{
    player: { type: String },
    team: { type: String },
    minute: { type: Number }
  }],
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);
export default Match;