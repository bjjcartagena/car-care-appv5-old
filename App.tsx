import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './screens/Login';
import Register from './screens/Register';
import VehicleTypeSelection from './screens/VehicleTypeSelection';
import VehicleProfileSetup from './screens/VehicleProfileSetup';
import Dashboard from './screens/Dashboard';
import TaskDetail from './screens/TaskDetail';
import Garage from './screens/Garage';
import History from './screens/History';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            {/* If no vehicles, maybe redirect to setup? For now default to standard flow */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/select-type" element={<VehicleTypeSelection />} />
            <Route path="/setup-profile" element={<VehicleProfileSetup />} />
            <Route path="/task-detail" element={<TaskDetail />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
