import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, BarChart, Users, Newspaper, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import api from '../services/api';

const HomePage = () => {
  // Get the current user from the AuthContext
  const { user } = useAuth(); 
  
  // State to track if the tournament has been simulated
  const [isSimulated, setIsSimulated] = useState(false);

  // Effect to check simulation status if a rep is logged in
  useEffect(() => {
    // Only run this check if a rep is logged in and has a team
    if (user && user.role === 'representative' && user.team) {
      
      const checkSimulationStatus = async () => {
        try {
          const { data: matches } = await api.get('/matches');
          // If 7 matches exist, the tournament is complete
          if (matches.length === 7) {
            setIsSimulated(true);
          }
        } catch (error) {
          // If it fails (e.g., 404), no matches exist
          setIsSimulated(false);
        }
      };
      
      checkSimulationStatus();
    }
  }, [user]); // Re-run this check when the user logs in


  // --- 1. Renders the Admin-specific homepage ---
  if (user && user.role === 'admin') {
    return (
      <div className="text-white">
        <div className="text-center py-20 md:py-32">
          <Trophy className="w-24 h-24 text-lime-400 mx-auto animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-extrabold mt-6">
            Administrator Control Panel
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mt-4 max-w-2xl mx-auto">
            You can view results, generate summaries, and run simulations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <BracketCard />
          <ScorersCard />
          <SummaryCard />
          <AdminPanelCard />
        </div>
      </div>
    );
  }

  // --- 2. Renders the Representative-specific homepage ---
  if (user && user.role === 'representative') {
    const hasTeam = !!user.team;
    return (
      <div className="text-white">
        <div className="text-center py-20 md:py-32">
          <Trophy className="w-24 h-24 text-lime-400 mx-auto animate-pulse" />
          
          {/* --- NEW TITLE LOGIC --- */}
          <h1 className="text-4xl md:text-6xl font-extrabold mt-6">
            {/* If they have a team, show "Team Registered", otherwise "Welcome [Name]" */}
            {hasTeam ? "Your Team is Registered!" : `Welcome, ${user.name}!`}
          </h1>
          
          {/* --- NEW SUB-TEXT LOGIC --- */}
          <p className="text-xl md:text-2xl text-gray-300 mt-4 max-w-2xl mx-auto">
            {hasTeam 
              ? (isSimulated // If they have a team, check simulation status
                  ? "You can now view the official tournament results." 
                  : "Waiting for the administrator to simulate the tournament...")
              : "Your next step is to register your federation for the tournament." // If no team
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BracketCard />
          <ScorersCard />
          {/* Shows "Register" if no team, "Summary" if they have a team */}
          {hasTeam ? <SummaryCard /> : <RegisterTeamCard />}
        </div>
      </div>
    );
  }

  // --- 3. Renders the Default Visitor homepage ---
  return (
    <div className="text-white">
      <div className="text-center py-20 md:py-32">
        <Trophy className="w-24 h-24 text-lime-400 mx-auto animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-extrabold mt-6">
          Welcome to the African Nations League
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mt-4 max-w-2xl mx-auto">
          The official home for the 2026 tournament.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BracketCard />
        <ScorersCard />
        <FederationPortalCard />
      </div>
    </div>
  );
};

// --- Re-usable Card Components ---

const BracketCard = () => (
  <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 flex flex-col">
    <BarChart className="w-12 h-12 text-blue-400 mb-4" />
    <h2 className="text-2xl font-bold mb-3">View the Bracket</h2>
    <p className="text-gray-400 mb-5 flex-grow">
      Follow the "Road to the Final" and see results from every match.
    </p>
    <Link
      to="/bracket"
      className="inline-block text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      See the full bracket
    </Link>
  </div>
);

const ScorersCard = () => (
  <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 flex flex-col">
    <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
    <h2 className="text-2xl font-bold mb-3">Top Goalscorers</h2>
    <p className="text-gray-400 mb-5 flex-grow">
      Check the rankings to see who will take home the Golden Boot.
    </p>
    <Link
      to="/scorers"
      className="inline-block text-center bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      See all scorers
    </Link>
  </div>
);

const SummaryCard = () => (
  <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 flex flex-col">
    <Newspaper className="w-12 h-12 text-purple-400 mb-4" />
    <h2 className="text-2xl font-bold mb-3">Read the Summary</h2>
    <p className="text-gray-400 mb-5 flex-grow">
      Read the official generated summary of the tournament.
    </p>
    <Link
      to="/summary"
      className="inline-block text-center bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      View Summary
    </Link>
  </div>
);

const AdminPanelCard = () => (
  <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 flex flex-col">
    <Shield className="w-12 h-12 text-red-400 mb-4" />
    <h2 className="text-2xl font-bold mb-3">Admin Settings</h2>
    <p className="text-gray-400 mb-5 flex-grow">
      Simulate the tournament and generate the official summary.
    </p>
    <Link
      to="/admin"
      className="inline-block text-center bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      Go to Admin Panel
    </Link>
  </div>
);

const FederationPortalCard = () => (
  <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 flex flex-col">
    <Users className="w-12 h-12 text-green-400 mb-4" />
    <h2 className="text-2xl font-bold mb-3">Federation Portal</h2>
    <p className="text-gray-400 mb-5 flex-grow">
      Representatives can log in or sign up to register their national team.
    </p>
    <Link
      to="/login"
      className="inline-block text-center bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      Login or Sign Up
    </Link>
  </div>
);

const RegisterTeamCard = () => (
  <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 flex flex-col">
    <Users className="w-12 h-12 text-lime-400 mb-4" />
    <h2 className="text-2xl font-bold mb-3">Register Your Team</h2>
    <p className="text-gray-400 mb-5 flex-grow">
      Click here to go to the federation registration page.
    </p>
    <Link
      to="/register-team"
      className="inline-block text-center bg-lime-600 hover:bg-lime-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      Register Team
    </Link>
  </div>
);

export default HomePage;