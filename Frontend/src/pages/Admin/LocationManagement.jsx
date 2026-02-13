import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/tables/GenericTable";
import DropdownButton from "../../components/common/DropdownButton";
import InputForm from "../../components/common/InputForm";
import EditForm from "../../components/Common/EditForm";

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
    const [openForm, setOpenForm] = useState(false);
    const [viewDetails, setViewDetails] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [editLocation, setEditLocation] = useState(false);

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

    const showDetails = (row) => {
        setSelectedLocation(row);
        setViewDetails(prev => !prev);
    }

    const editDetails = (row) => {
        setSelectedLocation(row);
        setEditLocation(prev => !prev);
    }

    const actions = (row) => (
        <DropdownButton
        label="⋯"
        items={[
            { label: "View Details", onClick: () => showDetails(row) },
            { label: "Edit", onClick: () => editDetails(row) },
            {
            label: "Delete",
            danger: true,
            onClick: () => handleDelete(row),
            },
        ]}
        />
    );

    const locTypeOptions = locations
        .map((loc) => loc.type)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((type) => ({ label: type, value: type }));
    locTypeOptions.unshift({ label: "-- Select Type ---", value: "" });

    const fieldValues = [
        { label: "Location ID", name: "id", type: "text" },
        { label: "Name", name: "name", type: "text" },
        { label: "Type", name: "type", type: "select", options: locTypeOptions },
        { label: "City", name: "city", type: "text" },
        { label: "State", name: "state", type: "text" },    
        { label: "Country", name: "country", type: "text" },
        { label: "Address Line 1", name: "address_line1", type: "text" },
        { label: "Address Line 2", name: "address_line2", type: "text" },
        { label: "Postal Code", name: "postal_code", type: "text" },
    ];

    const handleEditSubmit = async (formData) => {
        const response = await fetch(`http://127.0.0.1:8000/api/seed/locations/${selectedLocation.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            alert(`Location ${selectedLocation.name} updated successfully.`);
        }
        setEditLocation(false);
    }

    const handleDelete = async (row) => {
        const confirm = window.confirm(`Delete location: ${row.name}?`);
        if (confirm) {
            const response = await fetch(`http://127.0.0.1:8000/api/seed/locations/${row.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert(`Location ${row.name} deleted successfully.`);
            }
        }
    }

    const handleFormSubmit = async (formData) => {
        const response = await fetch('http://127.0.0.1:8000/api/seed/locations/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log('Location added:', data);
        setOpenForm(false);
    };

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
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700" onClick={() => setOpenForm(prev => !prev)}>
            + Add Location
            </button>
            {openForm && 
                <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex flex-row gap-4">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Add New Location</h3>
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
                    <p><strong>ID:</strong> {selectedLocation.id}</p>
                    <p><strong>Name:</strong> {selectedLocation.name}</p>
                    <p><strong>Type:</strong> {selectedLocation.type}</p>
                    <p><strong>Address Line 1:</strong> {selectedLocation.address_line1}</p>
                    <p><strong>Address Line 2:</strong> {selectedLocation.address_line2}</p>
                    <p><strong>City:</strong> {selectedLocation.city}</p>
                    <p><strong>State:</strong> {selectedLocation.state}</p>
                    <p><strong>Postal Code:</strong> {selectedLocation.postal_code}</p>
                    <p><strong>Country:</strong> {selectedLocation.country}</p>
                    </div>
                </div>
            }
            {editLocation && 
                <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex flex-row gap-4">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Edit Location</h3>
                        <button className="cursor-pointer text-white ml-auto" onClick={() => setEditLocation(prev => !prev)}>X</button>
                    </div>
                    <EditForm fieldValues={fieldValues} onSubmit={handleEditSubmit} initialValues={selectedLocation}/>
                </div>
            }
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
