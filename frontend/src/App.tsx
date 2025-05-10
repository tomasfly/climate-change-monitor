import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';

import { theme } from './theme';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { Home } from './pages/Home';
import { Zones } from './pages/Zones';
import { Actions } from './pages/Actions';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);
const queryClient = new QueryClient();

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route
                  path="/zones"
                  element={
                    <PrivateRoute>
                      <Zones />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/actions"
                  element={
                    <PrivateRoute>
                      <Actions />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </MsalProvider>
  );
}

export default App; 