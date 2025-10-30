import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, LogOut, UserPlus, LogIn, Shield, Edit, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkStyle = "text-gray-300 hover:text-white hover:bg-gray-700 py-2 px-3 rounded-lg transition-colors duration-200";

  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        <Link to="/" 
          className="flex items-center space-x-2 py-2 px-3 rounded-lg bg-gray-900 shadow-md border border-gray-700 hover:bg-gray-700 hover:shadow-lg transition-all duration-200"
        >
          <Trophy className="h-8 w-8 text-lime-400" />
          <span className="text-white text-xl font-bold">African Nations League</span>
        </Link>

        <div className="flex items-center space-x-2">
          
          <Link to="/bracket" className={`${linkStyle} font-semibold`}>
            Bracket
          </Link>
          <Link to="/scorers" className={`${linkStyle} font-semibold`}>
            Scorers
          </Link>
          <Link to="/summary" className={`${linkStyle} font-semibold`}>
            Summary
          </Link>
          
          {user && user.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`${linkStyle} text-yellow-400 hover:text-yellow-300 font-bold flex items-center`}
            >
              <Shield size={18} className="mr-1" /> Admin Settings
            </Link>
          )}

          {/* LINK 1: Show "Register Team" if rep has NO team */}
          {user && user.role === 'representative' && !user.team && (
            <Link 
              to="/register-team" 
              className={`${linkStyle} text-lime-400 hover:text-lime-300 font-bold flex items-center`}
            >
               <Edit size={18} className="mr-1" /> Register Team
            </Link>
          )}
          
          {/* LINK 2: Show "View My Team" if rep HAS a team */}
          {user && user.role === 'representative' && user.team && (
            <Link 
              to="/my-team" 
              className={`${linkStyle} text-blue-400 hover:text-blue-300 font-bold flex items-center`}
            >
               <Users size={18} className="mr-1" /> View My Team
            </Link>
          )}

          {user ? (
            <>
              {/* --- THIS IS THE FIX ---
                  It now correctly uses user.name */}
              <span className="text-gray-400 text-sm hidden md:block">
                Logged in as: {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center transition-colors"
              >
                <LogOut size={18} className="mr-1" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkStyle}>
                <LogIn size={18} className="mr-1" /> Login
              </Link>
              <Link to="/signup" className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg flex items-center transition-colors">
                <UserPlus size={18} className="mr-1" /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;