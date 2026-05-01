import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HospitalDashboard from './pages/Hospital/HospitalDashboard';
import HospitalInventory from './pages/Hospital/HospitalInventory';
import HospitalOrders from './pages/Hospital/HospitalOrders';
import Forecast from './pages/Hospital/Forecast';
import HospitalAlerts from './pages/Hospital/HospitalAlerts';
import HospitalReports from './pages/Hospital/HospitalReports';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import VendorInventory from './pages/Vendor/VendorInventory';
import VendorOrders from './pages/Vendor/VendorOrders';
import Shipments from './pages/Vendor/Shipments';
import Batches from './pages/Vendor/Batches';
import SalesAnalytics from './pages/Vendor/SalesAnalytics';
import AdminDashboard from './pages/Admin/AdminDashboard';
import LocationManagement from './pages/Admin/LocationManagement';
import OrdersOverview from './pages/Admin/OrdersOverview';
import UserManagement from './pages/Admin/UserManagement';
import DrugManagement from './pages/Admin/DrugManagement';
import DemoHome from './pages/DemoHome';
import Login from './pages/Login';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/demo" element={<DemoHome />} />

        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/inventory" element={<HospitalInventory />} />
        <Route path="/hospital/orders" element={<HospitalOrders />} />
        <Route path="/hospital/predictions" element={<Forecast />} />
        <Route path="/hospital/alerts" element={<HospitalAlerts />} />
        <Route path="/hospital/reports" element={<HospitalReports />} />

        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/inventory" element={<VendorInventory />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/vendor/shipments" element={<Shipments />} />
        <Route path="/vendor/batches" element={<Batches />} />
        <Route path="/vendor/analytics" element={<SalesAnalytics />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/orders" element={<OrdersOverview />} />
        <Route path="/admin/locations" element={<LocationManagement />} />
        <Route path="/admin/drugs" element={<DrugManagement />} />
      </Routes>
    </Router>
  );
}
