import DashboardLayout from '../components/layouts/DashboardLayout';
import KPI from '../components/cards/KPI';

export default function AdminDashboard() {
    return (
        <DashboardLayout title="Admin Dashboard" sideBarItems={["Dashboard", "Inventory", "Orders", "AI Predictions", "Expiry Alerts", "Reports"]}>
            <KPI title="Total Users" value="1,250" />
            <KPI title="Active Hospitals" value="85" />
            <KPI title="Vendors Registered" value="40" />
        </DashboardLayout>
    );
}