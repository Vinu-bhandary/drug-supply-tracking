import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/Tables/GenericTable";
import DropdownButton from "../../components/common/DropdownButton";
import EditForm from "../../components/Common/EditForm";
import InputForm from "../../components/common/InputForm";

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
    const [editData, setEditData] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [openForm, setOpenForm] = useState(false);
    
    let location_id = localStorage.getItem('location_id');
    location_id = String(location_id);
    useEffect(() => async () => {
        const response = await fetch(`http://localhost:8000/api/data/inventory/${location_id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            setData(result);
        }, []);

    const fieldValues = [
        { label: 'ID', name: 'id', type: 'text' },
        { label: 'Location ID', name: 'location_id', type: 'text' },
        { label: 'Drug ID', name: 'drug_id', type: 'text' },
        { label: 'Batch ID', name: 'batch_id', type: 'text' },
        { label: 'Quantity on Hand', name: 'qty_on_hand', type: 'number' },
        { label: 'Expiration Date', name: 'exp_date', type: 'date' },
    ];

    const handleFormSubmit = async (formData) => {
        const response = await fetch('http://localhost:8000/api/data/inventory/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
            alert(`Inventory item ${result.id} added successfully.`);
        }
        setOpenForm(false);
    };

    const handleEditSubmit = async (formData) => {
        const response = await fetch(`http://localhost:8000/api/data/inventory/${selectedData.id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
            alert(`Inventory item ${selectedData.id} updated successfully.`);
        }
        setEditData(false);
    };

    const editClick = (row) => {
        setSelectedData(row);
        setEditData(true);
    }

    const actions = (row) => (
        <DropdownButton
        label="⋯"
        items={[
            { label: "Edit", onClick: () => editClick(row) },
        ]}
        />
    );

    return (
        <DashboardLayout dashboardTitle="Hospital Inventory" dashboardSubtitle="Manage your hospital's medical supplies and equipment." userRole="Hospital Admin" userName="John Doe">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Drug Management</h2>
                    <p className="text-sm text-slate-500">
                        Manage the inventory.
                    </p>
                </div>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700" onClick={() =>setOpenForm(prev => !prev)}>
                    + Add Inventory Items
                </button>
                {openForm && <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex flex-row gap-4">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Add New Drug</h3>
                        <button className="cursor-pointer text-white ml-auto" onClick={() => setOpenForm(prev => !prev)}>X</button>
                    </div>
                    <InputForm fieldValues={fieldValues} onSubmit={handleFormSubmit} />
                    </div>}
            </div>
            {editData && 
                <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex flex-row gap-4">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Edit Inventory Item</h3>
                        <button className="cursor-pointer text-white ml-auto" onClick={() => setEditData(prev => !prev)}>X</button>
                    </div>
                    <EditForm fieldValues={fieldValues} onSubmit={handleEditSubmit} initialValues={selectedData}/>
                </div>
            }
            <GenericTable
                columns={[
                    { key: 'drug_id', label: 'Drug ID' },
                    { key: 'batch_id', label: 'Batch ID' },
                    { key: 'qty_on_hand', label: 'Quantity' },
                    { key: 'exp_date', label: 'Expiration Date', date: true },
                ]}
                data={data}
                actions={actions}
            />
        </DashboardLayout>
    );
}