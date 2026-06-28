import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Campsites from './pages/Campsites';
import Dashboard from './pages/Dashboard';
import AddCampsite from './pages/AddCampsite';
import EditCampsite from './pages/EditCampsite';
import CampsiteDetails from './pages/CampsiteDetails';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/campsites" element={<Campsites />} />
          <Route path="/campsites/:id" element={<CampsiteDetails />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Owner Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['ROLE_OWNER']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/add-campsite" element={
            <ProtectedRoute allowedRoles={['ROLE_OWNER']}>
              <AddCampsite />
            </ProtectedRoute>
          } />
          <Route path="/edit-campsite/:id" element={
            <ProtectedRoute allowedRoles={['ROLE_OWNER']}>
              <EditCampsite />
            </ProtectedRoute>
          } />

          {/* Customer Routes */}
          <Route path="/customer-dashboard" element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
