import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import StatCard from '../components/Common/StatCard';
import LineChart from '../components/Charts/LineChart';
import DoughnutChart from '../components/Charts/DoughnutChart';
import OrdersTable from '../components/Tables/OrdersTable';
import { vendorData } from '../data/vendorData';

export default function VendorDashboard() {
    const [data, setData] = useState(vendorData);

    useEffect(() => {
        setData(vendorData);
    }, []);

    const chartData = [
        { name: 'Oct', orders: 85, value: 32000 },
        { name: 'Nov', orders: 110, value: 42000 },
        { name: 'Dec', orders: 145, value: 55000 },
        { name: 'Jan', orders: 120, value: 48000 },
    ];

    const statusData = [
        { name: 'Delivered', value: 95 },
        { name: 'Pending', value: 35 },
    ];

    return (
        <DashboardLayout
        dashboardTitle="Vendor Dashboard"
        dashboardSubtitle="Supply chain overview and shipment tracking."
        userRole="Vendor Admin"
        userName="Vendor"
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
            <LineChart data={chartData} title="Delivery Performance" />
            </div>
            <DoughnutChart data={statusData} title="Order Status Distribution" />
        </div>

        <OrdersTable data={data.orders} />
        </DashboardLayout>
    );
}
