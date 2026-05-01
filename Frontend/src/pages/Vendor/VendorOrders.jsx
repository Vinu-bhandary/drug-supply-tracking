import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import OrdersTable from "../../components/Tables/OrdersTable";
import DropdownButton from "../../components/Common/DropdownButton";

export default function VendorOrders() {
    const user = localStorage.getItem("role");
    useEffect(() => {
        if (user !== 'vendor') {
            alert("You are not authorized to access this page.");
            window.location.href = "/";
            return;
        }
    })
    const [orders, setOrders] = useState([]);
    const [currLocation, setCurrLocation] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [verifyFormOpen, setVerifyFormOpen] = useState(false);
    const [verifyResult, setVerifyResult] = useState(null);


    useEffect(() => async () => {
        const loc_id = localStorage.getItem('location_id');
        const response = await fetch(`http://127.0.0.1:8000/api/seed/orders/${loc_id}/${user}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        setOrders(result);

        const currLocation = localStorage.getItem('location_id');
        const locationResponse = await fetch(`http://127.0.0.1:8000/api/seed/locations/${currLocation}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const locationResult = await locationResponse.json();
        setCurrLocation(locationResult);
    }, []);

    const shipOrder = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);

        const payload = {
            order_id: form.get("order_id"),
            carrier_name: form.get("carrier_name"),
            tracking_number: form.get("tracking_number"),
        };

        const response = await fetch(`http://127.0.0.1:8000/api/seed/orders/ship/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (response.ok) {
            alert("Order Shipped Successfully!");
            setShowForm(false);
            setSelectedOrder(null);
            window.location.reload();
        }
    };

    const deliverOrder = async (order_id) => {
        const response = await fetch(`http://127.0.0.1:8000/api/seed/orders/deliver/${order_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (response.ok) {
            alert("Order Delivered Successfully!");
            window.location.reload();
        }
    };

    const cancelOrder = async (order_id) => {
        const response = await fetch(`http://127.0.0.1:8000/api/seed/orders/cancel/${order_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (response.ok) {
            alert("Order Cancelled Successfully!");
            window.location.reload();
        }
    };

    const viewOrder = (row) => {
        setSelectedOrder(row);
        setDetailsModalOpen(true);
    };

    const verifyPage = (row) => {
        setSelectedOrder(row);
        setVerifyFormOpen(true);
    };


    const verifyOrder = (order_id) => {
        const order = orders.find((o) => o.id === order_id);
        if(order.status === "PENDING" ) {
            setVerifyResult({
                status: "Verified",
                details: `This order was recorded on the blockchain with transaction hash: ${order.order_block_hash}`
            })
        } else if (order.status === "SHIPPED") {
            setVerifyResult({
                status: "Verified",
                details: `This order's shipment was recorded on the blockchain with transaction hash: ${order.shipped_block_hash}`
            })
        } else if (order.status === "DELIVERED" || order.status === "IN-INVENTORY") {
            setVerifyResult({
                status: "Verified",
                details: `This order's delivery was recorded on the blockchain with transaction hash: ${order.delivered_block_hash}`
            })
        } else if (order.status === "CANCELLED") {
            setVerifyResult({
                status: "Verified",
                details: `This order's cancellation was recorded on the blockchain with transaction hash: ${order.cancelled_block_hash}`
            })
        } else {
            setVerifyResult({
                status: "Not Verified",
                details: "No blockchain record found for this order. It may not have been recorded on the blockchain yet."
            })
        }
    };

    const actions = (row) => (
        <DropdownButton
        label="⋯"
        items={[
            { label: "View details", onClick: () => viewOrder(row) },
            { label: "Verify Transaction", onClick: () => verifyPage(row) },
            ...(row.status === "PENDING"
            ? [
                {
                    label: "Mark as shipped",
                    onClick: () => {setSelectedOrder(row); setShowForm(prev => !prev)},
                },
                ]
            : []),
            ...(row.status === "SHIPPED"
            ? [
                {
                    label: "Mark as delivered",
                    onClick: () => { confirm("Are you sure you want to mark this order as delivered?") && deliverOrder(row.id) },
                },
                ]
            : []),
            ...(row.status === "PENDING"
            ? [
                {
                    label: "Cancel order",
                    danger: true,
                    onClick: () => { confirm("Are you sure you want to cancel this order?") && cancelOrder(row.id) },
                },
                ]
            : []),
        ]}
        />
    );



    return (
        <DashboardLayout dashboardTitle="Vendor Orders" dashboardSubtitle="Manage and track your orders." userRole="Vendor Admin" userName="Jane Smith">
            {showForm && (
                <form onSubmit={shipOrder} style={{ marginBottom: "20px" }} className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ship Order</h3>
                    <button type="button" onClick={() => setShowForm(false)} className="text-gray-200 hover:text-gray-700">Cancel</button>
                    </div>
                    <label className="block mb-2 text-gray-900">Order ID</label>
                    <input type="text" name="order_id" className="w-full mb-4 p-2 border border-gray-300 text-gray-900 rounded" value={selectedOrder ? selectedOrder.id : ""} readOnly />
                    <label className="block mb-2 text-gray-900">Carrier Name</label>
                    <input type="text" name="carrier_name" className="w-full mb-4 p-2 border border-gray-300 text-gray-900 rounded" required />
                    <label className="block mb-2 text-gray-900">Tracking Number</label>
                    <input type="text" name="tracking_number" className="w-full mb-4 p-2 border border-gray-300 text-gray-900 rounded" required />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Ship</button>
                </form>
            )}
            {detailsModalOpen && selectedOrder && (
                <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-gray-50 p-6 shadow-lg">
                    <div className="mb-6 flex flex-row gap-4 md:flex-col md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                    <p className="text-sm text-gray-600 mb-2">Order ID: {selectedOrder.order_number}</p>
                    <p className="text-sm text-gray-600 mb-2">From: {selectedOrder.from_location_id}</p>
                    <p className="text-sm text-gray-600 mb-2">To: {selectedOrder.to_location_id}</p>
                    <p className="text-sm text-gray-600 mb-2">Status: {selectedOrder.status}</p>
                    <p className="text-sm text-gray-600 mb-2">Created: {selectedOrder.created_at}</p>
                    {selectedOrder.shipped_at && <p className="text-sm text-gray-600 mb-2">Shipped: {selectedOrder.shipped_at}</p>}
                    {selectedOrder.delivered_at && <p className="text-sm text-gray-600 mb-2">Delivered: {selectedOrder.delivered_at}</p>}
                    {selectedOrder.carrier_name && <p className="text-sm text-gray-600 mb-2">Carrier: {selectedOrder.carrier_name}</p>}
                    <button type="button" onClick={() => setDetailsModalOpen(false)} className="text-gray-200 hover:text-gray-700">Close</button>
                </div>
                </div>
            )}

            {verifyFormOpen && selectedOrder && (
                <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-gray-50 p-6 shadow-lg">
                    <div className="mb-6 flex flex-row gap-4 md:flex-col md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Order</h3>
                    <p className="text-sm text-gray-600 mb-2">Order ID: {selectedOrder.order_number}</p>
                    <p className="text-sm text-gray-600 mb-2">From: {selectedOrder.from_location_id}</p>
                    <p className="text-sm text-gray-600 mb-2">To: {selectedOrder.to_location_id}</p>
                    <p className="text-sm text-gray-600 mb-2">Status: {selectedOrder.status}</p>
                    <p className="text-sm text-gray-600 mb-2">Created: {selectedOrder.created_at}</p>
                    {selectedOrder.shipped_at && <p className="text-sm text-gray-600 mb-2">Shipped: {selectedOrder.shipped_at}</p>}
                    {selectedOrder.delivered_at && <p className="text-sm text-gray-600 mb-2">Delivered: {selectedOrder.delivered_at}</p>}
                    {selectedOrder.carrier_name && <p className="text-sm text-gray-600 mb-2">Carrier: {selectedOrder.carrier_name}</p>}
                    <button type="button" onClick={() => { setVerifyFormOpen(false); verifyOrder(selectedOrder.id); }} className="px-4 py-2 bg-blue-500 text-white rounded">Verify</button>
                    <button type="button" onClick={() => setVerifyFormOpen(false)} className="text-gray-200 hover:text-gray-700">Close</button>
                </div>
                </div>
            )}

            {verifyResult && (
                <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-lg -translate-x-1/2 rounded-lg bg-gray-50 p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Result</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        Status: {verifyResult.status}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        {verifyResult.details}
                    </p>
                    <button type="button" onClick={() => setVerifyResult(null)} className="text-gray-200 hover:text-gray-700">Close</button>
                </div>
            )}

            <OrdersTable data={orders} actions={actions} />
        </DashboardLayout>
    );
}