export const adminData = {
    stats: [
        { id: 1, label: 'Total Drugs', value: '1247', icon: '💊', color: 'blue', change: '+45' },
        { id: 2, label: 'Low Stock Alerts', value: '23', icon: '🔴', color: 'red', change: '+5' },
        { id: 3, label: 'Total Orders', value: '456', icon: '📋', color: 'green', change: '+89' },
        { id: 4, label: 'Active Hospitals', value: '12', icon: '🏥', color: 'purple', change: '+2' }
    ],
    orders: [
        { id: 1, orderId: 'ORD-501', drug: 'Aspirin 500mg', quantity: '1000 tablets', status: 'Completed', date: '2024-11-27' },
        { id: 2, orderId: 'ORD-502', drug: 'Insulin Glargine', quantity: '100 units', status: 'Pending', date: '2024-11-28' },
        { id: 3, orderId: 'ORD-503', drug: 'Paracetamol 500mg', quantity: '5000 tablets', status: 'Delayed', date: '2024-11-25' },
    ]
};
