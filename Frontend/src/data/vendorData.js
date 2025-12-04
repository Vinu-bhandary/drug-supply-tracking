export const vendorData = {
    stats: [
        { id: 1, label: 'Total Incoming Orders', value: '156', icon: '📦', color: 'blue', change: '+12%' },
        { id: 2, label: 'Pending Confirmations', value: '23', icon: '⏳', color: 'yellow', change: '-8%' },
        { id: 3, label: 'Orders Processing', value: '47', icon: '⚙️', color: 'purple', change: '+5%' },
        { id: 4, label: 'Delayed Shipments', value: '8', icon: '⚠️', color: 'red', change: '-15%' }
    ],
    orders: [
        { id: 1, orderId: 'ORD-701', drug: 'Clopidogrel 75mg', quantity: '10000 tablets', status: 'Processing', date: '2024-11-27' },
        { id: 2, orderId: 'ORD-702', drug: 'Levothyroxine 100mcg', quantity: '5000 tablets', status: 'Shipped', date: '2024-11-28' },
        { id: 3, orderId: 'ORD-703', drug: 'Atorvastatin 20mg', quantity: '8000 tablets', status: 'Delivered', date: '2024-11-26' },
    ]
};
