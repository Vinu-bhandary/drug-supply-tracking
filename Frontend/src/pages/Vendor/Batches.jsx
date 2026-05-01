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
    const [drugs, setDrugs] = useState([]);
    const [openForm, setOpenForm] = useState(false);

    useEffect(() => async () => {
        const batchesData = await fetch(`http://127.0.0.1:8000/api/seed/batches/`).then(res => res.json());
        setBatches(batchesData);
        const drugsData = await fetch('http://127.0.0.1:8000/api/seed/drugs/').then(res => res.json());
        setDrugs(drugsData);
    }, []);

    const drugOptions = drugs.map(drug => ({ label: drug.name, value: drug.id }));
    drugOptions.unshift({ label: '--Select a drug--', value: '' });

    const fieldValues = [
        { label: 'Drug', name: 'drug_id', type: 'select', options: drugOptions },
        { label: 'Batch Number', name: 'batch_number', type: 'text' },
        { label: 'Manufacturing Date', name: 'mfg_date', type: 'date' },
        { label: 'Expiration Date', name: 'exp_date', type: 'date' },
    ];

    const handleFormSubmit = async (formData) => {
        console.log(formData);
        const response = await fetch(`http://localhost:8000/api/seed/batches/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });    
        const result = await response.json();
        if (result.ok) {
            alert(result.message);
        }
        else {
            alert(result.detail);
        }
        setOpenForm(prev => !prev);
    }; 

    return (
        <DashboardLayout dashboardTitle="Batch Management" dashboardSubtitle="Manage drug batches.">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Batch Management</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setOpenForm(prev => !prev)}>
                    +Add New Batch
                </button>
            </div>
            {openForm && <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg">
                                <div className="flex flex-row gap-4">
                                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Add New Drug</h3>
                                    <button className="cursor-pointer text-white ml-auto" onClick={() => setOpenForm(prev => !prev)}>X</button>
                                </div>
                                <InputForm fieldValues={fieldValues} onSubmit={handleFormSubmit} />
                                </div>}
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