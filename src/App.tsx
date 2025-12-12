import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/Login/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import ConsultationsTable from './ui/pages/Consultations/Consultations';
import AccountDetails from './ui/pages/AccountDetails/AccountDetails';
import ConsultantOverview from './components/Dashboard/ConsultantOverview';
import ConsultantDetails from './components/Dashboard/ConsultantDetails';
import CustomerProfile from './components/Dashboard/CustomerProfile';
import CMS from './components/Dashboard/CMS';
import Consultants from './components/Dashboard/Consultants';
import Reports from './components/Dashboard/Reports';
import { theme } from './theme/theme';
import './styles/globals.css';
import './styles/components.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/consultations" replace />} />
        <Route path="consultations" element={<ConsultationsTable />} />
        <Route path="account/:userId" element={<AccountDetails />} />
        <Route path="consultant/:staffId" element={<ConsultantOverview />} />
        <Route path="consultant-details/:staffId" element={<ConsultantDetails />} />
        <Route path="customer/:userId" element={<CustomerProfile />} />
        <Route path="cms" element={<CMS />} />
        <Route path="consultants" element={<Consultants />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
