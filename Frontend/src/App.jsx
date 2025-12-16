import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HospitalDashboard from './pages/Hospital/HospitalDashboard';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import {AdminDashboard, UserManagement, OrdersOverview, LocationManagement} from './pages/Admin/AdminDashboard';
import DemoHome from './pages/DemoHome';
import Login from './pages/Login';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/demo" element={<DemoHome />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/orders" element={<OrdersOverview />} />
        <Route path="/admin/locations" element={<LocationManagement />} />
      </Routes>
    </Router>
  );
}
