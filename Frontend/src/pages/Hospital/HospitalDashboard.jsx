import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatCard from '../../components/Common/StatCard';
import LineChart from '../../components/Charts/LineChart';
import DoughnutChart from '../../components/Charts/DoughnutChart';
import OrdersTable from '../../components/Tables/OrdersTable';
import { hospitalData } from '../../data/hospitalData';

export default function HospitalDashboard() {
  const user = localStorage.getItem('role');
  const loc_id = localStorage.getItem('location_id')
  useEffect(() => {
    if (user !== 'hospital') {
      alert('You are not authorized to access this page.');
      window.location.href = '/';
      return;
    }
  })
  const [data, setData] = useState(hospitalData);


  useEffect(() => async () => {
          const adminData = await fetch(`http://127.0.0.1:8000/api/seed/hospitalDashboard/${loc_id}`).then(res => res.json());
          setData(adminData);
      }, []);
  console.log(data);


      const chartData = data.chartData || [];

    const statusData = data.statusData || [];


  return (
    <DashboardLayout
      dashboardTitle="Hospital Dashboard"
      dashboardSubtitle="Welcome back! Here's your inventory overview."
      userRole="Hospital Admin"
      userName="John Doe"
    >
      {console.log(data)}
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


    </DashboardLayout>
  );
}
