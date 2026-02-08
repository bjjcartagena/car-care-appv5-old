import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute'; <--- Lo hemos desactivado

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
          {/* Rutas de acceso (las dejamos por si acaso) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- ZONA LIBRE (Sin Login) --- */}
          {/* Al entrar, vas directo a la pantalla de selección (Coche/Moto) */}
          <Route path="/" element={<VehicleTypeSelection />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/select-type" element={<VehicleTypeSelection />} />
          <Route path="/setup-profile" element={<VehicleProfileSetup />} />
          <Route path="/task-detail" element={<TaskDetail />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
