import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import OrdersTable from "../../components/Tables/OrdersTable";

export default function VendorOrders() {
    const user = localStorage.getItem("role");
    useEffect(() => {
        if (user !== 'vendor') {
            alert("You are not authorized to access this page.");
            window.location.href = "/";
            return;
        }
    })
    const [orders, setOrders] = useState([]);
    return (
        <DashboardLayout dashboardTitle="Vendor Orders" dashboardSubtitle="Manage and track your orders." userRole="Vendor Admin" userName="Jane Smith">
            <OrdersTable data={orders} />
        </DashboardLayout>
    );
}