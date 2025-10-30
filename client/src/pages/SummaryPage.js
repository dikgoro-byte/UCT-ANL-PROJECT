import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, Zap, Newspaper } from 'lucide-react';

const SummaryPage = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/summary/latest');
        setSummary(data.text);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch summary.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-12 h-12 text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg max-w-lg mx-auto">
        <Zap className="w-12 h-12 mx-auto text-red-500" />
        <h3 className="mt-4 text-xl font-bold text-white">{error}</h3>
        <p className="text-gray-400 mt-2">The administrator must simulate and generate a summary first.</p>
      </div>
    );
  }

  const parts = summary.trim().split('\n\n');
  const title = parts[0] || 'Tournament Summary';
  const body = parts.slice(1).join('\n\n');
  
  return (
    <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 md:p-10">
      <h1 className="text-4xl font-extrabold text-white text-center mb-6 flex items-center justify-center">
        <Newspaper className="w-10 h-10 mr-3 text-blue-400" />
        Official Tournament Summary
      </h1>
      
      <div className="text-gray-300 text-lg leading-relaxed">
        <p className="text-2xl font-bold text-white mb-6 text-center">
          {title}
        </p>
        <p className="whitespace-pre-line">
          {body}
        </p>
      </div>
    </div>
  );
};

export default SummaryPage;