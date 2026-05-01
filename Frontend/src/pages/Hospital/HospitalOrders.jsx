import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import OrdersTable from "../../components/Tables/OrdersTable";
import OrderForm from "../../components/Common/OrderForm";

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
    const loc_id = localStorage.getItem('location_id');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => async () => {
        const ordersData = await fetch(`http://127.0.0.1:8000/api/seed/orders/${loc_id}/${user}`).then(res => res.json());
        setOrders(ordersData);
    }, []);

    const handleSubmit = async (data) => {
        const response = await fetch(`http://127.0.0.1:8000/api/seed/orders/${loc_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert("Order Created Successfully!");
        } else {
            alert("Failed to Create Order");
        }
        window.location.reload();
    };

    return (
        <DashboardLayout dashboardTitle="Hospital Orders" dashboardSubtitle="View and manage your hospital's orders." userRole="Hospital Admin" userName="John Doe">
        <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: "20px" }}>
            {showForm ? "Hide Order Form" : "Create New Order"}
        </button>
        {showForm && <OrderForm onSubmit={handleSubmit} />}
            <OrdersTable data={orders} />
        </DashboardLayout>
    );
}