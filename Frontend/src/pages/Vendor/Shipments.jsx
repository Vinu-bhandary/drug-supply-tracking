import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/Tables/GenericTable";


export default function Shipments() {
    const user = localStorage.getItem("role");
    useEffect(() => {
        if (user !== 'vendor') {
            alert("You are not authorized to access this page.");
            window.location.href = "/";
            return;
        }
    })

    const [shipments, setShipments] = useState([]);

    useEffect(() => async () => {
        const shipmentsData = await fetch(`http://127.0.0.1:8000/api/seed/orders/${localStorage.getItem('location_id')}/${user}`).then(res => res.json());
        setShipments(shipmentsData);
    }, []);


    const shippedOrders = shipments.filter(order => order.status === 'SHIPPED' || order.status === 'DELIVERED');


    return (
        <DashboardLayout dashboardTitle="Shipments" dashboardSubtitle="Manage and track your shipments.">
            <GenericTable
                data={shippedOrders}
                columns={[
                    { key: 'order_number', label: 'Order Number' },
                    { key: 'tracking_number', label: 'Tracking Number' },
                    { key: 'carrier_name', label: 'Carrier' },
                    { key: 'to_location_id', label: 'Destination' },
                    { key: 'status', label: 'Status' },
                ]}
            />
        </DashboardLayout>
    );
}