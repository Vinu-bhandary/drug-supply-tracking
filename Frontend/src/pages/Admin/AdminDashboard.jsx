import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatCard from '../../components/Common/StatCard';
import LineChart from '../../components/Charts/LineChart';
import DoughnutChart from '../../components/Charts/DoughnutChart';
import GenericTable from '../../components/Tables/GenericTable';
import { adminData } from '../../data/adminData';

export default function AdminDashboard() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'admin') {
            alert('You are not authorized to access this page.');
            window.location.href = '/';
            return;
        }
    })
    const [data, setData] = useState(adminData);

    useEffect(() => async () => {
        const adminData = await fetch('http://127.0.0.1:8000/api/seed/dashboard').then(res => res.json());
        setData(adminData);
    }, []);

    const chartData = data.chartData || [];

    const statusData = data.statusData || [];

    return (
        <DashboardLayout
        dashboardTitle="Admin Dashboard"
        dashboardSubtitle="System-wide overview and control panel."
        userRole="System Owner"
        userName="Admin"
        >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {data.stats.map(stat => (
            <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                change={stat.change}
            />
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
            <LineChart data={chartData} title="Global Orders Trend" />
            </div>
            <DoughnutChart data={statusData} title="Order Status" />
        </div>
        

        </DashboardLayout>
    );
}
