import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// App Layout component
const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-slate-800 text-white px-8 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-200">Welcome, {user?.full_name || user?.username}</span>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-slate-700 px-8">
        <Link to="/dashboard" className="inline-block text-white px-4 py-3 hover:bg-slate-600 transition-colors">Dashboard</Link>
        <Link to="/projects" className="inline-block text-white px-4 py-3 hover:bg-slate-600 transition-colors">Projects</Link>
        <Link to="/tasks" className="inline-block text-white px-4 py-3 hover:bg-slate-600 transition-colors">Tasks</Link>
      </nav>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
