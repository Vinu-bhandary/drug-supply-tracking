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
    const [currLocation, setCurrLocation] = useState("");

    useEffect(() => async () => {
        const loc_id = localStorage.getItem('location_id');
        const response = await fetch(`http://127.0.0.1:8000/api/seed/orders/${loc_id}/${user}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        setOrders(result);

        const currLocation = localStorage.getItem('location_id');
        const locationResponse = await fetch(`http://127.0.0.1:8000/api/seed/locations/${currLocation}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const locationResult = await locationResponse.json();
        setCurrLocation(locationResult);
    }, []);



    return (
        <DashboardLayout dashboardTitle="Vendor Orders" dashboardSubtitle="Manage and track your orders." userRole="Vendor Admin" userName="Jane Smith">
            <OrdersTable data={orders} />
        </DashboardLayout>
    );
}