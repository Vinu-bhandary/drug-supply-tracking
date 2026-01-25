import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";


export default function HospitalReports() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'hospital') {
        alert('You are not authorized to access this page.');
        window.location.href = '/';
        return;
        }
    })
    const [reports, setReports] = useState([]);

    return (
        <DashboardLayout dashboardTitle="Hospital Reports" dashboardSubtitle="View and manage your hospital's reports." userRole="Hospital Admin" userName="John Doe">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Reports</h2>
            </div>
        </DashboardLayout>
    );
}