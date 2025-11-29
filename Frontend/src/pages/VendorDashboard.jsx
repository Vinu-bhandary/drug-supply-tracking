import DashboardLayout from '../components/layouts/DashboardLayout';
import KPI from '../components/cards/KPI';

export default function AdminDashboard() {
    return (
        <DashboardLayout title="Vendor Dashboard" sideBarItems={["Dashboard", "Inventory", "Orders", "AI Predictions", "Expiry Alerts", "Reports"]}>
            <KPI title="Total Orders" value="125" />
            <KPI title="Completed Orders" value="85" />
            <KPI title="Pending Orders" value="40" />
        </DashboardLayout>
    );
}