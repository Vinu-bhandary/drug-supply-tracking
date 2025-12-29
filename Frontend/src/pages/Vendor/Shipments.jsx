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

    return (
        <DashboardLayout dashboardTitle="Shipments" dashboardSubtitle="Manage and track your shipments.">
            <GenericTable
                data={shipments}
                columns={[
                    { key: 'trackingNumber', label: 'Tracking Number' },
                    { key: 'destination', label: 'Destination' },
                    { key: 'status', label: 'Status' },
                ]}
                actions={[]}
            />
        </DashboardLayout>
    );
}