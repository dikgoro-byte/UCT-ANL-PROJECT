import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy } from 'lucide-react';

const ScorersPage = () => {
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScorers = async () => {
      try {
        const { data } = await api.get('/matches');
        const allScorers = data.flatMap(match => match.scorers);
        
        const playerGoals = allScorers.reduce((acc, scorer) => {
          const playerName = scorer.player;
          const teamName = scorer.team;
          const key = `${playerName} (${teamName})`;

          if (!acc[key]) {
            acc[key] = { name: playerName, team: teamName, goals: 0 };
          }
          acc[key].goals++;
          return acc;
        }, {});

        const sortedScorers = Object.values(playerGoals).sort((a, b) => b.goals - a.goals);
        
        setScorers(sortedScorers);
      } catch (err) {
        console.error("Failed to fetch scorers", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScorers();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-8 flex items-center justify-center">
        <Trophy className="w-10 h-10 mr-3 text-yellow-400" />
        Top Goalscorers
      </h1>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <p className="text-center p-8 text-gray-300">Loading top scorers...</p>
        ) : scorers.length === 0 ? (
          <p className="text-center p-8 text-gray-300">No matches have been simulated yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Goals</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {scorers.map((player, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-white">{player.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-300">{player.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-lime-400">{player.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ScorersPage;