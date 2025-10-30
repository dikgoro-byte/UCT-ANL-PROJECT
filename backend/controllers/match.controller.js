import Match from '../models/match.model.js';
import Team from '../models/team.model.js';
import Summary from '../models/summary.model.js';

// --- 1. THIS IS THE  "EMAIL" FUNCTION ---
const sendTournamentCompleteEmail = (emailList, winner) => {
  console.log("==========================================");
  console.log("--- 📧 SIMULATING EMAIL NOTIFICATION ---");
  console.log(`RECIPIENTS: ${emailList.join(', ')}`);
  console.log(`SUBJECT: Tournament Results: A Winner is Crowned!`);
  console.log(`BODY: The tournament is complete. The winner is ${winner}!`);
  console.log("==========================================");
};

// -- Scorer Logic ---
const getScorers = (score, team) => {
  const scorersList = [];
  let goalsToDistribute = score;
  while (goalsToDistribute > 0) {
    const player = team.squad[Math.floor(Math.random() * 23)].name;
    let goals = 1;
    if (goalsToDistribute >= 2 && Math.random() > 0.7) { goals = 2; }
    if (goalsToDistribute >= 3 && Math.random() > 0.85) { goals = 3; }
    for (let i = 0; i < goals; i++) {
      scorersList.push({
        player: player,
        team: team.country,
        minute: Math.floor(Math.random() * 90) + 1
      });
    }
    goalsToDistribute -= goals;
  }
  return scorersList;
};

const simulateMatchLogic = (teamA, teamB, round, matchNumber) => {
  let scoreA = Math.floor(Math.random() * (teamA.rating / 18));
  let scoreB = Math.floor(Math.random() * (teamB.rating / 18));
  if (scoreA === scoreB) {
    teamA.rating > teamB.rating ? scoreA++ : scoreB++;
  }
  const winner = scoreA > scoreB ? teamA._id : teamB._id;
  const scorersA = getScorers(scoreA, teamA);
  const scorersB = getScorers(scoreB, teamB);
  return {
    round, matchNumber,
    teamA: { team: teamA._id, score: scoreA },
    teamB: { team: teamB._id, score: scoreB },
    status: 'simulated', winner,
    scorers: [...scorersA, ...scorersB].sort((a, b) => a.minute - b.minute)
  };
};

export const simulateTournament = async (req, res) => {
  try {
    await Match.deleteMany({});
    await Summary.deleteMany({}); 

    // --- 2. POPULATE THE REP EMAIL ---
    const teams = await Team.find({})
      .sort({ createdAt: 1 })
      .limit(8)
      .populate('representative', 'email'); // Get rep emails

    if (teams.length < 8) {
      return res.status(400).json({ message: `Need 8 teams to start. Only ${teams.length} registered.` });
    }

    let winners = [];
    const qfMatches = [];
    const qfWinners = [];
    
    qfMatches.push(simulateMatchLogic(teams[0], teams[1], 'quarter-final', 1));
    qfMatches.push(simulateMatchLogic(teams[2], teams[3], 'quarter-final', 2));
    qfMatches.push(simulateMatchLogic(teams[4], teams[5], 'quarter-final', 3));
    qfMatches.push(simulateMatchLogic(teams[6], teams[7], 'quarter-final', 4));

    for (const match of qfMatches) {
        const savedMatch = await new Match(match).save();
        qfWinners.push(await Team.findById(savedMatch.winner).populate('representative', 'email'));
    }
    winners = qfWinners;

    const sfMatches = [];
    const sfWinners = [];
    
    sfMatches.push(simulateMatchLogic(winners[0], winners[1], 'semi-final', 1));
    sfMatches.push(simulateMatchLogic(winners[2], winners[3], 'semi-final', 2));

    for (const match of sfMatches) {
        const savedMatch = await new Match(match).save();
        sfWinners.push(await Team.findById(savedMatch.winner).populate('representative', 'email'));
    }
    winners = sfWinners;

    const finalMatch = simulateMatchLogic(winners[0], winners[1], 'final', 1);
    const savedFinal = await new Match(finalMatch).save();
    
    const tournamentWinner = await Team.findById(savedFinal.winner);

    // --- 3. CALL THE 'EMAIL' FUNCTION ---
    const emailList = teams.map(team => team.representative.email);
    sendTournamentCompleteEmail(emailList, tournamentWinner.country);

    res.status(200).json({
      message: 'Tournament simulated successfully!',
      winner: tournamentWinner.country
    });

  } catch (error) {
    console.error("Simulation Error:", error)
    res.status(500).json({ message: "Simulation failed", error: error.message });
  }
};

export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find({})
      .populate('teamA.team', 'country')
      .populate('teamB.team', 'country')
      .populate('winner', 'country');
      
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};