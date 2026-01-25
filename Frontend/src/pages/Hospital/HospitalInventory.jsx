import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/Tables/GenericTable";

export default function HospitalInventory() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'hospital') {
        alert('You are not authorized to access this page.');
        window.location.href = '/';
        return;
        }
    })

    
    const [data, setData] = useState([]);
    


    return (
        <DashboardLayout dashboardTitle="Hospital Inventory" dashboardSubtitle="Manage your hospital's medical supplies and equipment." userRole="Hospital Admin" userName="John Doe">
            <GenericTable
                columns={[
                    { key: 'itemName', label: 'Item Name' },
                    { key: 'category', label: 'Category' },
                    { key: 'quantity', label: 'Quantity' },
                    { key: 'status', label: 'Status' },
                ]}
                data={data}
                actions={[]}
            />
        </DashboardLayout>
    );
}