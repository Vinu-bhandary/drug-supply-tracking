import { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/tables/GenericTable";
import Badge from "../../components/common/Badge";
import DropdownButton from "../../components/common/DropdownButton";
import StatCard from "../../components/Common/StatCard";

const MOCK_ORDERS = [
    {
        id: "order-001",
        order_number: "ORD-2024-0001",
        from_location: "City General Hospital, Mumbai",
        to_location: "MedSupply Distributors, Delhi",
        drug_summary: "Paracetamol 500mg, Metformin 500mg",
        total_qty: 500,
        status: "PENDING",
        created_at: "2024-11-25",
        shipped_at: null,
        delivered_at: null,
    },
    {
        id: "order-002",
        order_number: "ORD-2024-0002",
        from_location: "Fortis Healthcare, Bengaluru",
        to_location: "MedSupply Distributors, Delhi",
        drug_summary: "Amoxicillin 250mg",
        total_qty: 500,
        status: "SHIPPED",
        created_at: "2024-11-24",
        shipped_at: "2024-11-26",
        delivered_at: null,
    },
    {
        id: "order-003",
        order_number: "ORD-2024-0003",
        from_location: "City General Hospital, Mumbai",
        to_location: "MedSupply Distributors, Delhi",
        drug_summary: "Lisinopril 10mg",
        total_qty: 300,
        status: "DELIVERED",
        created_at: "2024-11-20",
        shipped_at: "2024-11-21",
        delivered_at: "2024-11-23",
    },
    {
        id: "order-004",
        order_number: "ORD-2024-0004",
        from_location: "City General Hospital, Mumbai",
        to_location: "MedSupply Distributors, Delhi",
        drug_summary: "Paracetamol 500mg",
        total_qty: 1000,
        status: "CANCELLED",
        created_at: "2024-11-19",
        shipped_at: null,
        delivered_at: null,
    },
];

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

    const [orders] = useState(MOCK_ORDERS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filtered = useMemo(() => {
        return orders.filter((order) => {
        const matchSearch =
            order.order_number.toLowerCase().includes(search.toLowerCase()) ||
            order.from_location.toLowerCase().includes(search.toLowerCase()) ||
            order.to_location.toLowerCase().includes(search.toLowerCase()) ||
            order.drug_summary.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "ALL" ? true : order.status === statusFilter;

        return matchSearch && matchStatus;
        });
    }, [orders, search, statusFilter]);

    const columns = [
        { key: "order_number", label: "Order ID" },
        { key: "from_location", label: "From" },
        { key: "to_location", label: "To" },
        { key: "drug_summary", label: "Drugs" },
        { key: "total_qty", label: "Total Qty" },
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
        dashboardSubtitle="System-wide orders overview."
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
