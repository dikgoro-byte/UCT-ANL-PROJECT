import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Summary = mongoose.model('Summary', summarySchema);
export default Summary;