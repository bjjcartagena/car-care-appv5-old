import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import VehicleTypeSelection from './screens/VehicleTypeSelection';
import VehicleProfileSetup from './screens/VehicleProfileSetup';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<VehicleTypeSelection />} />
          <Route path="/select-type" element={<VehicleTypeSelection />} />
          <Route path="/setup-profile" element={<VehicleProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};
export default App;
