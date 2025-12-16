import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HospitalDashboard from './pages/Hospital/HospitalDashboard';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
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
      </Routes>
    </Router>
  );
}
