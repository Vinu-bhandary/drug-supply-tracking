import { useState, useEffect } from "react";
import GenericTable from "../../components/Tables/GenericTable";
import InputForm from "../../components/common/InputForm";
import DashboardLayout from "../../components/Layout/DashboardLayout";

export default function Batches() {
    const user = localStorage.getItem("role");
    useEffect(() => {
        if (user !== 'vendor') {
            alert("You are not authorized to access this page.");
            window.location.href = "/";
            return;
        }
    })

    const [batches, setBatches] = useState([]);

    useEffect(() => async () => {
        const batchesData = await fetch(`http://127.0.0.1:8000/api/seed/batches/`).then(res => res.json());
        setBatches(batchesData);
    }, []);
    console.log(batches);

    return (
        <DashboardLayout dashboardTitle="Batch Management" dashboardSubtitle="Manage drug batches.">
            <div className="p-4 bg-white rounded shadow">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Batch Management</h2>
            </div>
            <GenericTable
                columns={[
                    { key: "id", label: "Batch ID" },
                    { key: "drug_id", label: "Drug ID" },
                    { key: "batch_number", label: "Batch Number" },
                    { key: "mfg_date", label: "Manufacturing Date" },
                    { key: "exp_date", label: "Expiration Date" },
                ]}
                data={batches}
            />
        </DashboardLayout>
    );
}