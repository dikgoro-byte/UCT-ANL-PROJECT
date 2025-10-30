import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, Zap, Users, Loader2, Award } from 'lucide-react';

const AdminPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [isSummaryGenerated, setIsSummaryGenerated] = useState(true);
  const [isTournamentSimulated, setIsTournamentSimulated] = useState(false);

  const checkTournamentState = async () => {
    let matchCount = 0;
    let summaryExists = false;
    try {
      const { data: matches } = await api.get('/matches');
      matchCount = matches.length;
    } catch (err) {}
    try {
      await api.get('/summary/latest');
      summaryExists = true;
    } catch (err) {}
    setIsTournamentSimulated(matchCount === 7);
    setIsSummaryGenerated(summaryExists);
  };

  const fetchTeamData = async () => {
    try {
      const { data } = await api.get('/teams');
      setTeams(data);
    } catch (err) {
      setError('Could not fetch teams.');
    }
  };

  useEffect(() => {
    fetchTeamData();
    checkTournamentState();
  }, []); 

  const handleSimulate = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/matches/simulate-tournament');
      
      // ---  NEW POP-UP MESSAGE ---
      setMessage(`Simulation complete! Winner: ${data.winner}. All federations notified by email.`);
      
      setIsTournamentSimulated(true);
      setIsSummaryGenerated(false); 
      fetchTeamData();
    } catch (err) {
      setError(err.response?.data?.message || 'Simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    setError('');
    setMessage('');
    try {
      await api.post('/summary/generate');
      setMessage('Summary generated successfully! Visitors can now see it.');
      setIsSummaryGenerated(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Summary generation failed.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const isTournamentReady = teams.length >= 8;
  const showSummaryButton = isTournamentSimulated && !isSummaryGenerated;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-8 flex items-center justify-center">
        <Shield className="w-10 h-10 mr-3 text-yellow-400" />
        Admin Panel
      </h1>
      
      {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm mb-4">{error}</p>}
      {message && <p className="text-lime-400 bg-lime-900/50 p-3 rounded-lg text-sm mb-4">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-4">Tournament Simulation</h2>
          <p className="text-gray-400 mb-4">
            This will delete all existing matches and the previous summary.
          </p>
          
          <button
            onClick={handleSimulate}
            disabled={loading || !isTournamentReady}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
            {loading ? 'Simulating...' : 'Simulate Tournament'}
          </button>
          {!isTournamentReady && (
            <p className="text-yellow-400 text-sm mt-2 text-center">
                You need {8 - teams.length} more team(s) to simulate.
            </p>
          )}

          {showSummaryButton && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 mb-4 text-center">
                Simulation complete. You can now generate the tournament summary.
              </p>
              <button
                onClick={handleGenerateSummary}
                disabled={summaryLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center transition-colors"
              >
                {summaryLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Award className="w-5 h-5 mr-2" />}
                {summaryLoading ? 'Generating Summary...' : 'Generate Summary'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center"><Users className="mr-2"/>Registered Teams ({teams.length}/8)</h2>
          <ul className="space-y-2 h-64 overflow-y-auto">
            {teams.map((team, index) => (
              <li key={team._id} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                <div>
                  <span className="font-bold">{index + 1}. {team.country}</span>
                  <span className="block text-xs text-gray-400">
                    Rep: {team.representative.name} ({team.representative.email})
                  </span>
                </div>
                <span className="text-sm text-lime-400 font-bold">Rating: {team.rating}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;