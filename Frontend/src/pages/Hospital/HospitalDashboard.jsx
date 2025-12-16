import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatCard from '../../components/Common/StatCard';
import LineChart from '../../components/Charts/LineChart';
import DoughnutChart from '../../components/Charts/DoughnutChart';
import OrdersTable from '../../components/Tables/OrdersTable';
import { hospitalData } from '../../data/hospitalData';

export default function HospitalDashboard() {
  const user = localStorage.getItem('role');
  useEffect(() => {
    if (user !== 'hospital') {
      alert('You are not authorized to access this page.');
      window.location.href = '/';
      return;
    }
  })
  const [data, setData] = useState(hospitalData);

  // Mock API call
  useEffect(() => {
    // fetch('/api/hospital/dashboard')
    //   .then(res => res.json())
    //   .then(setData)
    setData(hospitalData);
  }, []);

  const chartData = [
    { name: 'Oct', orders: 120, value: 45000 },
    { name: 'Nov', orders: 180, value: 52000 },
    { name: 'Dec', orders: 220, value: 61000 },
    { name: 'Jan', orders: 190, value: 58000 },
  ];

  const statusData = [
    { name: 'Active', value: 85 },
    { name: 'Low Stock', value: 15 },
  ];

  return (
    <DashboardLayout
      dashboardTitle="Hospital Dashboard"
      dashboardSubtitle="Welcome back! Here's your inventory overview."
      userRole="Hospital Admin"
      userName="John Doe"
    >
      {/* KPI Cards */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <LineChart data={chartData} title="Orders Trend (Last 4 Months)" />
        </div>
        <DoughnutChart data={statusData} title="Inventory Status" />
      </div>

      {/* Table */}
      <OrdersTable data={data.orders} />
    </DashboardLayout>
  );
}
