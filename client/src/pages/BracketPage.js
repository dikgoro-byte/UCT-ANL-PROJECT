import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BracketMatch from '../components/BracketMatch'; 
import { Trophy, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BracketPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await api.get('/matches');
        if (data.length === 0) {
            throw new Error('No match data found. Has the tournament been simulated?');
        }
        setMatches(data);
      } catch (err) {
        setError(err.message || 'Could not fetch tournament results.');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []); 

  const getMatch = (round, number) => {
    const match = matches.find(m => m.round === round && m.matchNumber === number);
    return {
      matchId: match?._id,
      teamA: match?.teamA?.team?.country || 'TBD',
      teamB: match?.teamB?.team?.country || 'TBD',
      scoreA: match?.teamA?.score ?? '-',
      scoreB: match?.teamB?.score ?? '-',
      matchStatus: match?.status || 'pending',
    };
  };

  if (loading) return <p className="text-center text-lg text-gray-300">Loading tournament bracket...</p>;
  
  if (error) {
     return (
        <div className="text-center p-8 bg-gray-800 rounded-lg max-w-lg mx-auto">
            <Zap className="w-12 h-12 mx-auto text-red-500" />
            <h3 className="mt-4 text-xl font-bold text-white">{error}</h3>
            <p className="text-gray-400 mt-2">The administrator must simulate the tournament first.</p>
        </div>
     );
  }

  const qf1 = getMatch('quarter-final', 1);
  const qf2 = getMatch('quarter-final', 2);
  const qf3 = getMatch('quarter-final', 3);
  const qf4 = getMatch('quarter-final', 4);
  const sf1 = getMatch('semi-final', 1);
  const sf2 = getMatch('semi-final', 2);
  const final = getMatch('final', 1);

  return (
    <div className="text-white">
      {/* Responsive Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 flex items-center justify-center">
        <Trophy className="w-10 h-10 md:w-12 md:h-12 mr-3 text-lime-400" />
        Road to the Final
      </h1>
      
      {/* Responsive Layout: Stacks on mobile, row on medium+ */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-4">
        
        {/* Left Side: Stacks on mobile, row on medium+ */}
        <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-8 md:space-y-0">
          <div className="space-y-16">
            <BracketMatch {...qf1} matchName="Quarter-Final 1" />
            <BracketMatch {...qf2} matchName="Quarter-Final 2" />
          </div>
          <div className="mt-8 md:mt-0"> {/* Add margin top only on mobile */}
            <BracketMatch {...sf1} matchName="Semi-Final 1" />
          </div>
        </div>
        
        {/* Center */}
        <div className="my-8 md:my-0">
          <BracketMatch {...final} matchName="THE GRAND FINAL" />
        </div>
        
        {/* Right Side: Stacks on mobile, row on medium+ */}
        <div className="flex flex-col-reverse md:flex-row items-center md:space-x-4 space-y-8 md:space-y-0">
         <div className="mb-8 md:mb-0"> {/* Add margin bottom only on mobile */}
          <BracketMatch {...sf2} matchName="Semi-Final 2" />
        </div>
        <div className="space-y-16">
          <BracketMatch {...qf3} matchName="Quarter-Final 3" />
          <BracketMatch {...qf4} matchName="Quarter-Final 4" />
        </div>
        </div>
      </div>
      
      {user && user.role === 'admin' && (
        <p className="text-center text-gray-400 text-sm mt-16">
          This bracket shows the results from the admin simulation.
        </p> 
        /* ^-- THIS WAS THE TYPO --^ */
      )}
    </div>
  );
};

export default BracketPage;