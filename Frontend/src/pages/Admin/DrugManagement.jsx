import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import GenericTable from '../../components/tables/GenericTable';
import DropdownButton from '../../components/common/DropdownButton';

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

    useEffect(() => async () => {
        const DRUGS = await fetch('http://127.0.0.1:8000/api/seed/drugs/').then(res => res.json());
        setDrugs(DRUGS);
    }, []);

    const filtered = drugs.filter((d) => {
        const matchSearch =
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.category.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "ALL" ? true : d.drug_type === typeFilter;
        return matchSearch && matchType;
    });

    const columns = [
        { key: 'name', label: 'Drug Name' },
        { key: 'category', label: 'Type' },
    ];
    const actions = (row) => (
        <DropdownButton
            label="⋯"
            items={[
                { label: 'View Details', onClick: () => console.log('view', row) },
                { label: 'Edit', onClick: () => console.log('edit', row) },
                {
                    label: 'Delete',
                    danger: true,
                    onClick: () => console.log('delete', row),
                },
            ]}
        />
    );
    return (
        <DashboardLayout
            title="Drug Management"
            subtitle="Manage Drugs"
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
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                + Add Drug
                </button>
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
                    <option value="ALL">All Types</option>
                    <option value="PRESCRIPTION">Prescription</option>
                    <option value="OVER_THE_COUNTER">Over the Counter</option>
                    <option value="CONTROLLED_SUBSTANCE">Controlled Substance</option>
                    <option value="OTHER">Other</option>
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