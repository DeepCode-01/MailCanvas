
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Sequences from './pages/Sequences';
import FlowEditorPage from './pages/FlowEditorPage';

// Layout
import MainLayout from './components/Layout/MainLayout';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/sequences" element={
          <ProtectedRoute>
            <MainLayout>
              <Sequences />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/editor/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <FlowEditorPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/editor" element={
          <ProtectedRoute>
            <MainLayout>
              <FlowEditorPage />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;