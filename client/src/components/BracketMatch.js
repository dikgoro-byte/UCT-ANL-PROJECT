import React from 'react';

const BracketMatch = ({ teamA, teamB, matchName, scoreA, scoreB, matchStatus }) => {
  // Determine winner for bolding
  const teamAClass = scoreA > scoreB ? 'font-bold text-white' : 'text-gray-300';
  const teamBClass = scoreB > scoreA ? 'font-bold text-white' : 'text-gray-300';

  return (
    <div className="bg-gray-800/70 border-2 border-green-500 p-3 rounded-lg min-w-[220px] shadow-lg">
      <p className="text-xs font-medium text-gray-400 mb-1 flex justify-between">
        <span>{matchName}</span>
        {matchStatus !== 'pending' && (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-600 text-green-300">
            SIMULATED
          </span>
        )}
      </p>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className={`text-sm truncate ${teamAClass}`}>{teamA}</span>
          <span className={`text-sm font-extrabold ${teamAClass}`}>{scoreA}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm truncate ${teamBClass}`}>{teamB}</span>
          <span className={`text-sm font-extrabold ${teamBClass}`}>{scoreB}</span>
        </div>
      </div>
    </div>
  );
};

export default BracketMatch;