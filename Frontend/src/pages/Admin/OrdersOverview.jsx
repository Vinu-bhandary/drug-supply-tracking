import { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/tables/GenericTable";
import Badge from "../../components/common/Badge";
import DropdownButton from "../../components/common/DropdownButton";
import StatCard from "../../components/Common/StatCard";

const statusToBadge = (status) => {
    switch (status) {
        case "PENDING":
        return { text: "Pending", type: "pending" };
        case "SHIPPED":
        return { text: "Shipped", type: "processing" };
        case "DELIVERED":
        return { text: "Delivered", type: "completed" };
        case "CANCELLED":
        return { text: "Cancelled", type: "cancelled" };
        default:
        return { text: status, type: "default" };
    }
};

export default function OrdersOverview() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'admin') {
            alert('You are not authorized to access this page.');
            window.location.href = '/';
            return;
        }
    })

    const ORDERS = [];

    const [orders, setOrders] = useState(ORDERS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => async () => {
        const ORDERS = await fetch('http://127.0.0.1:8000/api/seed/orders/').then(res => res.json());
        setOrders(ORDERS);
    }, [])

    const filtered = useMemo(() => {
        return orders.filter((order) => {
        const matchSearch =
            order.order_number.toLowerCase().includes(search.toLowerCase()) ||
            order.from_location_id.toLowerCase().includes(search.toLowerCase()) ||
            order.to_location_id.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "ALL" ? true : order.status === statusFilter;

        return matchSearch && matchStatus;
        });
    }, [orders, search, statusFilter]);

    const columns = [
        { key: "order_number", label: "Order ID" },
        { key: "from_location_id", label: "From" },
        { key: "to_location_id", label: "To" },
        {
        key: "status",
        label: "Status",
        render: (value) => {
            const { text, type } = statusToBadge(value);
            return <Badge text={text} type={type} />;
        },
        },
        { key: "created_at", label: "Created" },
    ];

    const actions = (row) => (
        <DropdownButton
        label="⋯"
        items={[
            { label: "View details", onClick: () => console.log("view", row) },
            { label: "Track shipment", onClick: () => console.log("track", row) },
            ...(row.status === "PENDING"
            ? [
                {
                    label: "Mark as shipped",
                    onClick: () => console.log("ship", row),
                },
                ]
            : []),
            ...(row.status === "SHIPPED"
            ? [
                {
                    label: "Mark as delivered",
                    onClick: () => console.log("deliver", row),
                },
                ]
            : []),
            ...(row.status === "PENDING"
            ? [
                {
                    label: "Cancel order",
                    danger: true,
                    onClick: () => console.log("cancel", row),
                },
                ]
            : []),
        ]}
        />
    );


    const stats = useMemo(() => {
        const total = orders.length;
        const pending = orders.filter((o) => o.status === "PENDING").length;
        const shipped = orders.filter((o) => o.status === "SHIPPED").length;
        const delivered = orders.filter((o) => o.status === "DELIVERED").length;
        const cancelled = orders.filter((o) => o.status === "CANCELLED").length;
        return { total, pending, shipped, delivered, cancelled };
    }, [orders]);

    return (
        <DashboardLayout
        dashboardTitle="Admin Dashboard"
        userRole="System Owner"
        userName="John Administrator"
        >
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
            <h2 className="text-xl font-semibold text-slate-900">Orders Overview</h2>
            <p className="text-sm text-slate-500">
                Monitor all orders across hospitals and vendors.
            </p>
            </div>
        </div>


        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
            <StatCard label="Total Orders" value={stats.total} color="purple" />
            <StatCard label="Pending" value={stats.pending} color="yellow" />
            <StatCard label="Shipped" value={stats.shipped} color="blue" />
            <StatCard label="Delivered" value={stats.delivered} color="green" />
            <StatCard label="Cancelled" value={stats.cancelled} color="red" />
        </div>


        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
            <input
                type="text"
                placeholder="Search by order, location, or drug…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
            />
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
            >
                <option value="ALL">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
            </select>
            </div>
            <p className="text-xs text-slate-500">
            Showing {filtered.length} of {orders.length} orders
            </p>
        </div>

        <GenericTable columns={columns} data={filtered} actions={actions} />

        </DashboardLayout>
    );
}
