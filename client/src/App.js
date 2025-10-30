import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

// Import Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import all our Pages
import HomePage from './pages/HomePage';
import BracketPage from './pages/BracketPage';
import ScorersPage from './pages/ScorersPage';
import SummaryPage from './pages/SummaryPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import TeamRegisterPage from './pages/TeamRegisterPage';
import TeamPage from './pages/TeamPage';
import AdminPage from './pages/AdminPage'; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="max-w-6xl mx-auto p-4 md:p-8 mt-16">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/bracket" element={<BracketPage />} />
            <Route path="/scorers" element={<ScorersPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* --- Protected Routes --- */}
            <Route
              path="/register-team"
              element={
                <ProtectedRoute role="representative">
                  <TeamRegisterPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-team"
              element={
                <ProtectedRoute role="representative">
                  <TeamPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />

          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;