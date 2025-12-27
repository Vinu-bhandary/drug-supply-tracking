import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/tables/GenericTable";
import DropdownButton from "../../components/common/DropdownButton";


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

  useEffect(() => async () => {
    const USERS = await fetch('http://127.0.0.1:8000/api/seed/users/').then(res => res.json());
    setUsers(USERS);
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

  const actions = (row) => (
    <DropdownButton
      label="⋯"
      items={[
        { label: "View", onClick: () => console.log("view", row) },
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
          <h2 className="text-xl font-semibold text-slate-900">User Management</h2>
          <p className="text-sm text-slate-500">
            Add, edit, and deactivate users across all locations.
          </p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          + Add User
        </button>
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
