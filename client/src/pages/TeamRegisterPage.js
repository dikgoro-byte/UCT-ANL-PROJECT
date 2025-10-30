import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldCheck, CheckCircle } from 'lucide-react';
import { africanCountries } from '../utils/africanCountries';

const TeamRegisterPage = () => {
  const [country, setCountry] = useState(africanCountries[0]);
  const [manager, setManager] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, fetchUser } = useAuth();
  
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (registrationSuccess) {
      
      const timer = setTimeout(() => {
        navigate('/');
      }, 4000); // 4000 milliseconds = 4 seconds

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/teams', { country, manager }); 
      setRegistrationSuccess(true); 
      await fetchUser(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderTeamInfo = () => (
    <div className="mt-4 p-4 bg-gray-700 rounded-lg">
      <h3 className="text-xl font-bold text-white">{user.team.country}</h3>
      <p className="text-gray-300">Manager: {user.team.manager}</p>
      <p className="text-lime-400 font-bold mt-2">Team Rating: {user.team.rating}</p>
    </div>
  );

  // Case 1: Just registered ( 4s redirect)
  if (registrationSuccess && user && user.team) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-400 mb-2">
          You have successfully registered a team!
        </h2>
        {renderTeamInfo()}
        {/* --- THIS IS THE CHANGE --- */}
        <p className="text-gray-400 text-sm mt-4">
          Redirecting to your homepage in 4 seconds...
        </p>
      </div>
    );
  }

  // Case 2: Revisiting the page
  if (!registrationSuccess && user && user.team) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-400 mb-2">
          You have already registered a team.
        </h2>
        <p className="text-gray-400">Your federation is ready for the tournament.</p>
        {renderTeamInfo()}
      </div>
    );
  }

  // Case 3: The registration form
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-8">Register Your Federation</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-300">
            Select Your Country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-lime-500 focus:border-lime-500"
          >
            {africanCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="manager" className="block text-sm font-medium text-gray-300">
            Manager Name
          </label>
          <input
            type="text"
            id="manager"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500"
          />
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Register Team'}
        </button>
      </form>
    </div>
  );
};

export default TeamRegisterPage;