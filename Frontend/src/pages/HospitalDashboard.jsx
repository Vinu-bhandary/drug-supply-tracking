import React from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import KPI from "../components/cards/KPI";

/**
 * HospitalDashboard.jsx
 * A self-contained implementation that reproduces the structure from your screenshots:
 * - Top row KPI cards
 * - Order pipeline table
 * - Shipment status list
 * - Vendor performance cards with mini charts
 *
 * Uses Tailwind-style utility classes. Adjust CSS classes if you're using a different system.
 */

const statCards = [
  { title: "Total Incoming Orders", value: "156", subtitle: "+12% vs last week", icon: "🛒" },
  { title: "Pending Confirmations", value: "23", subtitle: "-8% vs last week", icon: "⏱️" },
  { title: "Orders Processing", value: "47", subtitle: "+5% vs last week", icon: "📦" },
  { title: "Delayed Shipments", value: "8", subtitle: "-15% vs last week", icon: "⚠️" },
  { title: "Batches Near Expiry", value: "12", subtitle: "+3% next 30 days", icon: "📅" },
];

const sampleOrders = [
  { id: "ORD-2024-1847", drug: "Paracetamol 500mg", qty: "5,000 tablets", hospital: "City General Hospital, Mumbai", status: "Pending", due: "2024-12-05" },
  { id: "ORD-2024-1846", drug: "Amoxicillin 250mg", qty: "2,000 capsules", hospital: "Apollo Hospital, Delhi", status: "Processing", due: "2024-12-03" },
  { id: "ORD-2024-1845", drug: "Metformin 500mg", qty: "3,000 tablets", hospital: "Max Healthcare, Bangalore", status: "Shipped", due: "2024-12-02" },
];

const shipments = [
  { id: "ORD-2024-1845", status: "In Transit", location: "Max Healthcare, Bangalore", carrier: "BlueDart Express", eta: "Dec 2, 2024" },
  { id: "ORD-2024-1840", status: "Out for Delivery", location: "Apollo Hospital, Delhi", carrier: "DHL Logistics", eta: "Nov 28, 2024" },
  { id: "ORD-2024-1838", status: "Delivered", location: "Fortis Hospital, Chennai", carrier: "DTDC", eta: "Nov 27, 2024" },
];

function StatCard({ item }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col justify-between min-w-[180px]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">{item.title}</div>
          <div className="text-2xl font-bold mt-2">{item.value}</div>
        </div>
        <div className="text-3xl opacity-40">{item.icon}</div>
      </div>
      <div className="text-sm mt-4 text-gray-400">{item.subtitle}</div>
    </div>
  );
}

function OrdersTable({ orders }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Order Pipeline</h3>
            <p className="text-sm text-gray-500">Manage incoming orders and track progress</p>
          </div>
          <div className="flex gap-3">
            <input className="border rounded-md px-3 py-2 text-sm w-64" placeholder="Search orders..." />
            <button className="border rounded-md px-3 py-2 text-sm">All Status</button>
          </div>
        </div>
      </div>

      <table className="w-full text-left">
        <thead className="text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Drug Name</th>
            <th className="px-6 py-4">Quantity</th>
            <th className="px-6 py-4">Hospital</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="px-6 py-4 font-medium">{o.id}</td>
              <td className="px-6 py-4">{o.drug}</td>
              <td className="px-6 py-4">{o.qty}</td>
              <td className="px-6 py-4 text-gray-600">{o.hospital}</td>
              <td className="px-6 py-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusPillClass(o.status)}`}>{o.status}</span>
              </td>
              <td className="px-6 py-4 text-gray-600">{o.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function statusPillClass(status) {
  const mapping = {
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-indigo-100 text-indigo-700",
    Delivered: "bg-green-100 text-green-700",
    Delayed: "bg-red-100 text-red-700",
  };
  return mapping[status] || "bg-gray-100 text-gray-700";
}

function ShipmentItem({ s }) {
  return (
    <div className="border rounded-lg p-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center text-lg">
          🚚
        </div>
        <div>
          <div className="font-medium">
            {s.id} <span className="text-xs ml-2 px-2 py-1 rounded-full bg-blue-50 text-blue-600 align-middle">{s.status}</span>
          </div>
          <div className="text-sm text-gray-500">{s.location}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-500">{s.carrier}</div>
        <div className="font-semibold">{s.eta}</div>
      </div>
    </div>
  );
}

function ShipmentsList({ items }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Shipment Status</h3>
          <p className="text-sm text-gray-500">Track recent shipments and deliveries</p>
        </div>
        <button className="text-sm px-3 py-2 border rounded-md">View All ↗</button>
      </div>

      <div className="space-y-4">
        {items.map((s) => (
          <ShipmentItem s={s} key={s.id} />
        ))}
      </div>
    </div>
  );
}

/* Very simple mini charts built with SVG (non-interactive) */
function LineChartMini() {
  /* This is a presentational svg that roughly resembles the line area chart in the screenshots */
  return (
    <svg viewBox="0 0 200 70" className="w-full h-36">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#dff6ec" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#dff6ec" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,55 C30,45 60,60 90,40 120,30 150,42 200,20 L200,80 L0,80 Z" fill="url(#g1)" />
      <path d="M0,55 C30,45 60,60 90,40 120,30 150,42 200,20" fill="none" stroke="#0f9d58" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function BarChartMini() {
  return (
    <div className="w-full h-36 flex items-end gap-2">
      {[2.3, 2.0, 2.8, 1.9, 2.2, 1.7].map((h, i) => (
        <div key={i} style={{ height: `${h * 40}px` }} className="flex-1 rounded-sm"></div>
      ))}
    </div>
  );
}

/* === Modified: PerformanceCards now returns a full-width container === */
function PerformanceCards() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold mb-2">Vendor Performance</h4>
        <p className="text-sm text-gray-500 mb-4">Key metrics and delivery analytics</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="text-sm text-gray-500">On-Time Delivery</div>
            <div className="text-2xl font-bold">96.5%</div>
            <div className="text-sm text-green-500 mt-1">+2.3% (last 30 days)</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="text-sm text-gray-500">Avg Processing Time</div>
            <div className="text-2xl font-bold">1.8 days</div>
            <div className="text-sm text-red-500 mt-1">-12% (order to dispatch)</div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50">
            <div className="text-sm text-gray-500">Stockout Incidents</div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-red-500 mt-1">-40% this month</div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50">
            <div className="text-sm text-gray-500">Reliability Score</div>
            <div className="text-2xl font-bold">A+</div>
            <div className="text-sm text-gray-500 mt-1">Based on 156 orders</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-2">On-Time Delivery Rate</div>
            <LineChartMini />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Average Processing Time (Days)</div>
            <div className="bg-white p-4 border rounded">{/* simple blue bars */}
              <div className="h-36">
                <svg viewBox="0 0 200 80" className="w-full h-full">
                  <rect x="12" y="40" width="22" height="40" rx="2" fill="#2b9bd7" />
                  <rect x="44" y="48" width="22" height="32" rx="2" fill="#2b9bd7" />
                  <rect x="76" y="28" width="22" height="52" rx="2" fill="#2b9bd7" />
                  <rect x="108" y="44" width="22" height="36" rx="2" fill="#2b9bd7" />
                  <rect x="140" y="38" width="22" height="42" rx="2" fill="#2b9bd7" />
                  <rect x="172" y="52" width="22" height="28" rx="2" fill="#2b9bd7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HospitalDashboard() {
  return (
    <DashboardLayout
      title="Hospital Dashboard"
      sideBarItems={["Dashboard", "Orders", "Inventory", "Warehouses", "Shipments", "Forecasts", "Analytics", "Alerts", "Settings"]}
    >
      <div className="space-y-6">
        {/* KPIs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((s) => (
            <StatCard key={s.title} item={s} />
          ))}
        </div>

        {/* Top section: Orders (left) + Shipments (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <OrdersTable orders={sampleOrders} />
          </div>
          <div>
            <ShipmentsList items={shipments} />
          </div>
        </div>

        {/* Vendor performance & charts (now full-width) */}
        <PerformanceCards />
      </div>
    </DashboardLayout>
  );
}
