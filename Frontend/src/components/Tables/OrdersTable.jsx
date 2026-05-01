import React, { useState, useEffect } from 'react';
import GenericTable from './GenericTable';
import Badge from '../Common/Badge';
import DropdownButton from '../Common/DropdownButton';

export default function OrdersTable({ data, actions }) {

    const [detailsForm, setDetailsForm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [verifyResult, setVerifyResult] = useState(null);
    const [orders, setOrders] = useState([]);

    const viewOrder = (row) => {
        setSelectedOrder(row);
        setDetailsForm(true);
    };
    
    useEffect(() => {
        const fetchOrders = async () => {
            const loc_id = localStorage.getItem('location_id');
            const user = localStorage.getItem('role');
            const response = await fetch(`http://127.0.0.1:8000/api/seed/orders/${loc_id}/${user}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            setOrders(result);
        };
        fetchOrders();
    }, []);

    const orderCancel = async (id) => {
        const response = await fetch(`http://127.0.0.1:8000/api/seed/orders/cancel/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });        
    };             

    const cancelOrder = (id) => {
        if (confirm("Are you sure you want to cancel this order?")) {
            orderCancel(id);
            window.location.reload();
        }
    };

    const columns = [
        { key: "order_number", label: "Order ID" },
        { key: "from_location_id", label: "From" },
        { key: "to_location_id", label: "To" },
        {
        key: 'status',
        label: 'Status',
        render: (status) => <Badge text={status} type={status.toLowerCase()} />
        },
        { key: "created_at", label: "Created" },
    ];


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


    const actionsList = (row) => (
        <DropdownButton
        label="⋯"
        items={[
            { label: 'View Details', onClick: () => viewOrder(row) },
            { label: 'Verify Transaction', onClick: () => verifyOrder(row.id) },
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
        <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        {detailsForm && selectedOrder && (
            <div className="absolute top-20 left-1/2 z-50 w-11/12 max-w-lg -translate-x-1/2 rounded-lg bg-gray-50 p-6 shadow-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Order Details</h4>
                <p className="text-sm text-gray-600 mb-2">Order ID: {selectedOrder.order_number}</p>
                <p className="text-sm text-gray-600 mb-2">From: {selectedOrder.from_location_id}</p>
                <p className="text-sm text-gray-600 mb-2">To: {selectedOrder.to_location_id}</p>
                <p className="text-sm text-gray-600 mb-2">Status: {selectedOrder.status}</p>
                <p className="text-sm text-gray-600 mb-2">Created: {selectedOrder.created_at}</p>
                {selectedOrder.shipped_at && <p className="text-sm text-gray-600 mb-2">Shipped: {selectedOrder.shipped_at}</p>}
                {selectedOrder.delivered_at && <p className="text-sm text-gray-600 mb-2">Delivered: {selectedOrder.delivered_at}</p>}
                {selectedOrder.carrier_name && <p className="text-sm text-gray-600 mb-2">Carrier: {selectedOrder.carrier_name}</p>}
                <button className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700" onClick={() => setDetailsForm(false)}>Close</button>
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


        <GenericTable columns={columns} data={data} actions={actions? actions : actionsList} />
        </div>
    );
}
