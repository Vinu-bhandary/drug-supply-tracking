import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/tables/GenericTable";
import DropdownButton from "../../components/common/DropdownButton";
import InputForm from "../../components/common/InputForm";
import EditForm from "../../components/Common/EditForm";

export default function UserManagement() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'admin') {
            alert('You are not authorized to access this page.');
            window.location.href = '/';
            return;
        }
    })
  


  const USERS = [];
  const [users, setUsers] = useState(USERS);
  const [openForm, setOpenForm] = useState(false);
  const [locations, setLocations] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [editUser, setEditUser] = useState(false);

  useEffect(() => async () => {
    const USERS = await fetch('http://127.0.0.1:8000/api/seed/users/').then(res => res.json());
    setUsers(USERS);
    const LOCATIONS = await fetch('http://127.0.0.1:8000/api/seed/locations/').then(res => res.json());
    setLocations(LOCATIONS);
  }, []);

  console.log("Users: ", users);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" ? true : u.role === roleFilter;
    return matchSearch && matchRole;
  });
  console.log("Filtered: ",filtered);
  const columns = [
    { key: "username", label: "User" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "location", label: "Location" },
  ];

  const showDetails = (row) => {
    setSelectedUser(row);
    setViewDetails(prev => !prev);
  }

  const editDetails = (row) => {
    setSelectedUser(row);
    setEditUser(prev => !prev);
  }

  const handleDelete = async (row) => {
    const confirm = window.confirm(`Delete user: ${row.username}?`);
    if (confirm) {
      const response = await fetch(`http://127.0.0.1:8000/api/seed/users/${row.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert(`User ${row.username} deleted successfully.`);
      }
    }
  }

  const actions = (row) => (
    <DropdownButton
      label="⋯"
      items={[
        { label: "View", onClick: () => showDetails(row) },
        { label: "Edit Password", onClick: () => editDetails(row) },
        {
          label: "Delete",
          danger: true,
          onClick: () => handleDelete(row),
        },
      ]}
    />
  );

  const roleOptions = users
  .map((u) => u.role)
  .filter((value, index, self) => self.indexOf(value) === index)
  .map((role) => ({ label: role, value: role }));
  roleOptions.unshift({ label: "-- Select Role --", value: "" });

  const locationOptions = locations
  .map((u) => u.id)
  .filter((value, index, self) => self.indexOf(value) === index)
  .map((location) => ({ label: location, value: location }));
  locationOptions.unshift({ label: "-- Select Location --", value: "" });

  const fieldValues = [
    { label: "ID", name: "id", type: "text" },
    { label: "Username", name: "username", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Password", name: "password_hash", type: "password" },
    { label: "Role", name: "role", type: "select", options: roleOptions },
    { label: "Location", name: "location_id", type: "select", options: locationOptions },
  ];

  const handleEditSubmit = async (formData) => {
    console.log("Edit Form Data Submitted: ", formData);
    const response = await fetch(`http://127.0.0.1:8000/api/seed/users/${selectedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log('User edited:', data);
    setEditUser(false);
  };

  const handleFormSubmit = async (formData) => {
    console.log("Form Data Submitted: ", formData);
    const response = await fetch('http://127.0.0.1:8000/api/seed/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log('User added:', data);
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
          <h2 className="text-xl font-semibold text-slate-900">User Management</h2>
          <p className="text-sm text-slate-500">
            Add, edit, and deactivate users across all locations.
          </p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700" onClick={() => setOpenForm(true)}>
          + Add User
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
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Location:</strong> {selectedUser.location}</p>
              <p><strong>Location ID:</strong> {selectedUser.location_id}</p>
            </div>
          </div>}

        {editUser && 
          <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg">
            <div className="flex flex-row gap-4">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Edit User Password</h3>
                <button className="cursor-pointer text-white ml-auto" onClick={() => setEditUser(prev => !prev)}>X</button>
            </div>
            <EditForm fieldValues={[{ label: "Password", name: "password_hash", type: "password" }]} onSubmit={handleEditSubmit} />
          </div>}
      </div>


      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="HOSPITAL">Hospital</option>
            <option value="VENDOR">Vendor</option>
          </select>
        </div>
        <p className="text-xs text-slate-500">
          Showing {filtered.length} of {users.length} users
        </p>
      </div>


      <GenericTable columns={columns} data={filtered} actions={actions} />
      
    </DashboardLayout>
  );
}
