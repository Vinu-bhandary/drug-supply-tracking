import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HospitalDashboard from './pages/HospitalDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DemoHome from './pages/DemoHome';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DemoHome />} />
        <Route path="/dashboard/hospital" element={<HospitalDashboard />} />
        <Route path="/dashboard/vendor" element={<VendorDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
