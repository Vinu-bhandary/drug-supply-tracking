import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import StatCard from '../components/Common/StatCard';
import LineChart from '../components/Charts/LineChart';
import DoughnutChart from '../components/Charts/DoughnutChart';
import OrdersTable from '../components/Tables/OrdersTable';
import { adminData } from '../data/adminData';

export default function AdminDashboard() {
    const [data, setData] = useState(adminData);

    useEffect(() => {
        setData(adminData);
    }, []);

    const chartData = [
        { name: 'Oct', orders: 450, value: 150000 },
        { name: 'Nov', orders: 620, value: 195000 },
        { name: 'Dec', orders: 840, value: 260000 },
        { name: 'Jan', orders: 700, value: 220000 },
    ];

    const statusData = [
        { name: 'Active', value: 1100 },
        { name: 'Low Stock', value: 147 },
    ];

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
            <DoughnutChart data={statusData} title="Drug Catalog Status" />
        </div>

        <OrdersTable data={data.orders} />
        </DashboardLayout>
    );
}
