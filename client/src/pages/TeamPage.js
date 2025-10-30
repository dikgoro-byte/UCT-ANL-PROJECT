import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, UserCheck } from 'lucide-react';

const TeamPage = () => {
  const { user } = useAuth();

  // If for any reason a user lands here without a team, send them to register
  if (!user || !user.team) {
    return <Navigate to="/register-team" />;
  }

  const { team } = user;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-2">{team.country}</h1>
      <p className="text-center text-xl text-gray-400 mb-1">Manager: {team.manager}</p>
      <p className="text-center text-2xl font-bold text-lime-400 mb-8">
        Overall Rating: {team.rating}
      </p>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
        <h2 className="text-2xl font-bold p-4 bg-gray-700 flex items-center">
          <Users className="mr-3" />
          Official 23-Player Squad
        </h2>
        
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Player Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {team.squad.map((player) => (
              <tr key={player.name} className={`hover:bg-gray-700 ${player.isCaptain ? 'bg-lime-900/50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-white flex items-center">
                  {player.name}
                  {/* --- THIS IS THE CAPTAIN HIGHLIGHT --- */}
                  {player.isCaptain && (
                    <span className="ml-3 flex items-center text-xs font-bold text-lime-300 bg-lime-700/50 px-2 py-0.5 rounded-full">
                      <UserCheck size={14} className="mr-1" />
                      CAPTAIN
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-300">{player.naturalPosition}</td>
                <td className="px-6 py-4 whitespace-nowRrap text-lg font-bold text-lime-400">
                  {player.ratings[player.naturalPosition]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamPage;