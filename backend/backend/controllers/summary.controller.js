import Match from '../models/match.model.js';
import Summary from '../models/summary.model.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateSummary = async (req, res) => {
  try {
    const matches = await Match.find({ status: { $ne: 'pending' } })
      .populate('winner', 'country');

    if (matches.length < 7) {
      return res.status(400).json({ message: 'Tournament is not yet complete. Cannot generate summary.' });
    }
    
    const tournamentWinner = matches.find(m => m.round === 'final').winner.country;

    const mockSummaryText = `
${tournamentWinner} Crowned Champions in Stunning Final!

The 2026 African Nations League has concluded in spectacular fashion, with ${tournamentWinner} lifting the coveted trophy after a grueling and passionate tournament. Their journey to glory was a testament to skill, strategy, and pure determination.

The quarter-finals saw the 8 best teams battle it out, with fierce competition across the board. The victors then clashed in a pair of dramatic semi-finals that had fans on the edge of their seats.

But the final match was the true spectacle. ${tournamentWinner} faced their ultimate rival in a contest that will be remembered for years. After a tense 90 minutes, ${tournamentWinner} emerged victorious, etching their name in history as the champions of Africa.

This tournament was a showcase of the continent's finest talent, and we congratulate ${tournamentWinner} on their historic win!
    `;

    await sleep(2000); 
    await Summary.deleteMany({});
    const newSummary = await Summary.create({ text: mockSummaryText });

    res.status(201).json(newSummary);

  } catch (error) {
    console.error('Mock Summary Error:', error);
    res.status(500).json({ message: 'Failed to generate mock summary', error: error.message });
  }
};

export const getLatestSummary = async (req, res) => {
  try {
    const summary = await Summary.findOne().sort({ createdAt: -1 });
    
    if (summary) {
      res.json(summary);
    } else {
      res.status(404).json({ message: 'No summary has been generated yet.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};