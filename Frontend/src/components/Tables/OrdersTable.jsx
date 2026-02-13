import React from 'react';
import GenericTable from './GenericTable';
import Badge from '../Common/Badge';
import DropdownButton from '../Common/DropdownButton';

export default function OrdersTable({ data }) {
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

    const actions = (row) => (
        <DropdownButton
        label="⋯"
        items={[
            { label: 'View Details', onClick: () => console.log(row) },
            { label: 'Edit', onClick: () => console.log('Edit', row) },
            { label: 'Delete', onClick: () => console.log('Delete', row), danger: true },
        ]}
        />
    );

    return (
        <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <GenericTable columns={columns} data={data} actions={actions} />
        </div>
    );
}
