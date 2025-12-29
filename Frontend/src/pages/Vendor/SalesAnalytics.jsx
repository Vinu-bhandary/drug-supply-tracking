import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";

export default function SalesAnalytics() {
    const user = localStorage.getItem("role");
    useEffect(() => {
        if (user !== 'vendor') {
            alert("You are not authorized to access this page.");
            window.location.href = "/";
            return;
        }
    })

    const [analyticsData, setAnalyticsData] = useState([]);

    return (
        <DashboardLayout dashboardTitle="Sales Analytics" dashboardSubtitle="Analyze your sales performance and trends.">
            <div className="p-4 bg-white rounded shadow">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Sales Analytics Data</h2>
            </div>
        </DashboardLayout>
    );
}