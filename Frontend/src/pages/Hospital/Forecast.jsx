import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";

export default function Forecast() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'hospital') {
        alert('You are not authorized to access this page.');
        window.location.href = '/';
        return;
        }
    })
    const [forecastData, setForecastData] = useState([]);

    return (
        <DashboardLayout dashboardTitle="Forecast" dashboardSubtitle="View and manage your hospital's forecast." userRole="Hospital Admin" userName="John Doe">
            <div className="text-center mt-10 mb-10 px-4 py-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Forecast</h2>
            </div>
        </DashboardLayout>
    );
}