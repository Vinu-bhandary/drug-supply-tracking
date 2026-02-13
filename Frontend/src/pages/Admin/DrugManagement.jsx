import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import GenericTable from '../../components/tables/GenericTable';
import DropdownButton from '../../components/common/DropdownButton';
import InputForm from '../../components/common/InputForm';
import EditForm from '../../components/Common/EditForm';

export default function DrugManagement() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'admin') {
            alert('You are not authorized to access this page.');
            window.location.href = '/';
            return;
        }
    })

    const DRUGS = [];
    const [drugs, setDrugs] = useState(DRUGS);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [openForm, setOpenForm] = useState(false);
    const [viewDetails, setViewDetails] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState({});
    const [editDrug, setEditDrug] = useState(false);    

    useEffect(() => async () => {
        const DRUGS = await fetch('http://127.0.0.1:8000/api/seed/drugs/').then(res => res.json());
        setDrugs(DRUGS);
    }, []);

    const filtered = drugs.filter((d) => {
        const matchSearch =
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.category.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "ALL" ? true : d.category === typeFilter;
        return matchSearch && matchType;
    });

    const columns = [
        { key: 'name', label: 'Drug Name' },
        { key: 'category', label: 'Type' },
    ];

    const showDetails = (row) => {
        setSelectedDrug(row);
        setViewDetails(prev => !prev);
    }

    const editDetails = (row) => {
        setSelectedDrug(row);
        setEditDrug(prev => !prev);
    }

    const actions = (row) => (
        <DropdownButton
            label="⋯"
            items={[
                { label: 'View Details', onClick: () => showDetails(row) },
                { label: 'Edit', onClick: () => editDetails(row) },
                {
                    label: 'Delete',
                    danger: true,
                    onClick: () => handleDelete(row),
                },
            ]}
        />
    );

    const categoryOptions = drugs
        .map(d => d.category)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(cat => ({ label: cat, value: cat }));
    categoryOptions.unshift({label: '-- Select Category ---', value: ''});
    
    const unitOptions = drugs
        .map(d => d.unit)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(unit => ({ label: unit, value: unit }));
    unitOptions.unshift({label: '-- Select Unit ---', value: ''});

    const fieldValues = [
        { label: 'ID', name: 'id', type: 'text' },
        { label: 'Drug Name', name: 'name', type: 'text' },
        { label: 'Category', name: 'category', type: 'select', options: categoryOptions },
        { label: 'Strength', name: 'strength', type: 'text' },
        { label: 'Unit', name: 'unit', type: 'select', options: unitOptions },
        { label: 'Reorder Point', name: 'reorder_point', type: 'number' },
    ];

    const handleFormSubmit = async (formData) => {
        const response = await fetch('http://127.0.0.1:8000/api/seed/drugs/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log('Drug added:', data);

        setOpenForm(false);
    };

    const handleDelete = async (row) => {
        const confirm = window.confirm(`Delete drug: ${row.name}?`);
        if (confirm) {
            const response = await fetch(`http://127.0.0.1:8000/api/seed/drugs/${row.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert(`Drug ${row.name} deleted successfully.`);
            }
        }
    };

    const handleEditSubmit = async (formData) => {
        const response = await fetch(`http://127.0.0.1:8000/api/seed/drugs/${selectedDrug.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            alert(`Drug ${selectedDrug.name} updated successfully.`);
        }
        setEditDrug(false);
    };

    return (
        <DashboardLayout
            dashboardTitle="Admin Dashboard"
            userRole={user}
            userName={user}
        >
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                <h2 className="text-xl font-semibold text-slate-900">Drug Management</h2>
                <p className="text-sm text-slate-500">
                    Manage the drugs available in the system.
                </p>
                </div>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700" onClick={() =>setOpenForm(prev => !prev)}>
                + Add Drug
                </button>
                {openForm && <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg">
                <div className="flex flex-row gap-4">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Add New Drug</h3>
                    <button className="cursor-pointer text-white ml-auto" onClick={() => setOpenForm(prev => !prev)}>X</button>
                </div>
                <InputForm fieldValues={fieldValues} onSubmit={handleFormSubmit} />
                </div>}
                {viewDetails && 
                <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex flex-row gap-4">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">User Details</h3>
                        <button className="cursor-pointer text-white ml-auto" onClick={() => setViewDetails(prev => !prev)}>X</button>
                    </div>
                    <div className="text-sm text-slate-700">
                    <p><strong>ID:</strong> {selectedDrug.id}</p>
                    <p><strong>Drug Name:</strong> {selectedDrug.name}</p>
                    <p><strong>Category:</strong> {selectedDrug.category}</p>
                    <p><strong>Strength:</strong> {selectedDrug.strength}</p>
                    <p><strong>Unit:</strong> {selectedDrug.unit}</p>
                    <p><strong>Reorder Point:</strong> {selectedDrug.reorder_point}</p>
                    </div>
                </div>}

                {editDrug && 
                <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex flex-row gap-4">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Edit Drug</h3>
                        <button className="cursor-pointer text-white ml-auto" onClick={() => setEditDrug(prev => !prev)}>X</button>
                    </div>
                    <EditForm fieldValues={fieldValues} onSubmit={handleEditSubmit} initialValues={selectedDrug} />
                </div>}
            </div>

            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                <input
                    type="text"
                    placeholder="Search drugs…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                />
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                    <option value="ALL">ALL</option>
                    {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))}
                </select>
                </div>
                <p className="text-xs text-slate-500">
                Showing {filtered.length} of {drugs.length} drugs
                </p>
            </div>
            <GenericTable
                columns={columns}
                data={filtered}
                actions={actions}
            />
        </DashboardLayout>
    );
}