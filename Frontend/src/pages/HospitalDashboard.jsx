import DashboardLayout from '../components/layouts/DashboardLayout';
import KPI from '../components/cards/KPI';

export default function AdminDashboard() {
    return (
        <DashboardLayout title="Hospital Dashboard" sideBarItems={["Dashboard", "Inventory", "Orders", "AI Predictions", "Expiry Alerts", "Reports"]}>
            <KPI title="Total Drugs" value="1,250" />
            <KPI title="Active Orders" value="85" />
        </DashboardLayout>
    );
}