import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/Tables/GenericTable";


export default function HospitalReports() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'hospital') {
        alert('You are not authorized to access this page.');
        window.location.href = '/';
        return;
        }
    })
    const [consumptions, setConsumptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const location_id = localStorage.getItem('location_id');

    useEffect(() => {
        const fetchConsumptions = async () => {
            setLoading(true);
            const res = await fetch(`http://localhost:8000/api/data/consumption/loc/${location_id}`);
            const data = await res.json();
            setConsumptions(data);
            setLoading(false);
        };
        fetchConsumptions();
    }, []);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'drug_id', label: 'Drug' },
        { key: 'batch_id', label: 'Batch' },
        { key: 'qty_consumed', label: 'Quantity' },
        { key: 'consumption_date', label: 'Date' },
    ]

    return (
        <DashboardLayout dashboardTitle="Consumption Records" dashboardSubtitle="View and manage your hospital's reports." userRole="Hospital Admin" userName="John Doe">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Consumption Records</h2>
                <p className="text-gray-600 mb-6">Review the history of drug consumption at your hospital.</p>
            </div>
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : consumptions.length === 0 ? (
                <p className="text-gray-500">No consumption records found.</p>
            ) : (
                <GenericTable data={consumptions} columns={columns} />
            )}  

        </DashboardLayout>
    );
}