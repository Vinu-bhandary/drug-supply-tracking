import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/tables/GenericTable";
import DropdownButton from "../../components/common/DropdownButton";


export default function LocationManagement() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'admin') {
            alert('You are not authorized to access this page.');
            window.location.href = '/';
            return;
        }
    })

    const LOCATIONS = [];

    const [locations, setLocations] = useState(LOCATIONS);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");

    useEffect(() => async () => {
        const LOCATIONS = await fetch('http://127.0.0.1:8000/api/seed/locations/').then(res => res.json());
        setLocations(LOCATIONS);
    }, []);

    const filtered = locations.filter((loc) => {
        const matchSearch =
        loc.name.toLowerCase().includes(search.toLowerCase()) ||
        loc.city.toLowerCase().includes(search.toLowerCase()) ||
        loc.state.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "ALL" ? true : loc.type === typeFilter;
        return matchSearch && matchType;
    });

    const columns = [
        { key: "id", label: "Location ID" },
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "country", label: "Country" },
    ];

    const actions = (row) => (
        <DropdownButton
        label="⋯"
        items={[
            { label: "View Details", onClick: () => console.log("view", row) },
            { label: "Edit", onClick: () => console.log("edit", row) },
            {
            label: "Delete",
            danger: true,
            onClick: () => console.log("delete", row),
            },
        ]}
        />
    );

    return (
        <DashboardLayout
        dashboardTitle="Admin Dashboard"
        userRole="System Owner"
        userName="John Administrator"
        >
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
            <h2 className="text-xl font-semibold text-slate-900">Location Management</h2>
            <p className="text-sm text-slate-500">
                Configure all hospital and vendor locations in the network.
            </p>
            </div>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            + Add Location
            </button>
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
            <input
                type="text"
                placeholder="Search locations…"
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
                <option value="Hospital">Hospital</option>
                <option value="Vendor">Vendor</option>
            </select>
            </div>
            <p className="text-xs text-slate-500">
            Showing {filtered.length} of {locations.length} locations
            </p>
        </div>

        <GenericTable columns={columns} data={filtered} actions={actions} />

        </DashboardLayout>
    );
}
