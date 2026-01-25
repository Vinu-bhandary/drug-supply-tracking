import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import OrdersTable from "../../components/Tables/OrdersTable";

export default function HospitalOrders() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'hospital') {
        alert('You are not authorized to access this page.');
        window.location.href = '/';
        return;
        }
    })
    const [orders, setOrders] = useState([]);

    return (
        <DashboardLayout dashboardTitle="Hospital Orders" dashboardSubtitle="View and manage your hospital's orders." userRole="Hospital Admin" userName="John Doe">
            <OrdersTable data={orders} />
        </DashboardLayout>
    );
}