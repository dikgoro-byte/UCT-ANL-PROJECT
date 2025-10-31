import mongoose from 'mongoose';

// Sub-document for a single player
export const playerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  isCaptain: {
    type: Boolean,
    default: false,
  },
  naturalPosition: {
    type: String,
    enum: ['GK', 'DF', 'MD', 'AT'],
    required: true,
  },
  ratings: {
    GK: { type: Number, required: true },
    DF: { type: Number, required: true },
    MD: { type: Number, required: true },
    AT: { type: Number, required: true },
  }
}, { _id: false });