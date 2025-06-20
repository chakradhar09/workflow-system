import './App.css';
import React, { createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Admin from './components/Admin.jsx';
import User from './components/User.jsx';

// Placeholder components for different sections and authentication
const Dashboard = () => <h2>Dashboard Content</h2>;


function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <div className="app-container">
          <div className="sidebar">
            <h2>Navigation</h2>
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/admin">Admin Section</Link></li>
              <li><Link to="/user">User Section</Link></li>
            </ul>
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* Protect the /admin route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/user" element={<User />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

// --- Authentication Context and Mock ---
const AuthContext = createContext(null);

// Mock user with a role for demonstration
const mockUser = { role: 'admin' }; // Change 'admin' to 'user' to test restricted access

const AuthProvider = ({ children }) => {
  return <AuthContext.Provider value={{ user: mockUser }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  return user && user.role === requiredRole ? children : <Navigate to="/" replace />;
};
