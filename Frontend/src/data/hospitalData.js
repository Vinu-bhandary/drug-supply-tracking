export const hospitalData = {
    stats: [
        { id: 1, label: 'Total Orders', value: '128', icon: '📦', color: 'blue', change: '+12%' },
        { id: 2, label: 'Drugs Near Expiry', value: '8', icon: '⚠️', color: 'yellow', change: '+5' },
        { id: 3, label: 'Out of Stock', value: '4', icon: '❌', color: 'red', change: '-2' },
        { id: 4, label: 'AI Predicted Shortages', value: '6', icon: '🤖', color: 'purple', change: '+3' }
    ],
    orders: [
        { id: 1, orderId: 'ORD-001', drug: 'Amoxicillin 250mg', quantity: '200 capsules', status: 'Completed', date: '2024-11-27' },
        { id: 2, orderId: 'ORD-002', drug: 'Metformin 500mg', quantity: '300 tablets', status: 'Pending', date: '2024-11-28' },
        { id: 3, orderId: 'ORD-003', drug: 'Lisinopril 10mg', quantity: '200 tablets', status: 'Processing', date: '2024-11-26' },
    ]
};
