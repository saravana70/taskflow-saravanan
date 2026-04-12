import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import ProjectsList from './pages/ProjectsList';
import ProjectDetails from './pages/ProjectDetails';
import NotFound from './pages/NotFound';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="global-loader">
        <Spinner animation="border" />
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="global-loader">
        <Spinner animation="border" />
      </div>
    );
  }

  return !token ? <>{children}</> : <Navigate to="/projects" replace />;
};

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/projects" replace />} />

    <Route path="/login" element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    } />

    <Route path="/register" element={
      <PublicRoute>
        <Register />
      </PublicRoute>
    } />

    <Route path="/projects" element={
      <ProtectedRoute>
        <ProjectsList />
      </ProtectedRoute>
    } />

    <Route path="/projects/:id" element={
      <ProtectedRoute>
        <ProjectDetails />
      </ProtectedRoute>
    } />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </BrowserRouter>
);

export default App;