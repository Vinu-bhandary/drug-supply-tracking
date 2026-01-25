import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";

export default function HospitalAlerts() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'hospital') {
        alert('You are not authorized to access this page.');
        window.location.href = '/';
        return;
        }
    })
    const [alerts, setAlerts] = useState([]);

    return (
        <DashboardLayout dashboardTitle="Hospital Alerts" dashboardSubtitle="View and manage your hospital's alerts." userRole="Hospital Admin" userName="John Doe">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Alerts</h2>
            </div>
        </DashboardLayout>
    );
}   