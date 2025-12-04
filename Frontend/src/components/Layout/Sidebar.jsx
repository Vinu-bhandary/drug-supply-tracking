import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
        { id: 'inventory', label: 'Inventory', icon: '📦', path: '/inventory' },
        { id: 'orders', label: 'Orders', icon: '🛒', path: '/orders', badge: '3' },
        { id: 'shipments', label: 'Shipments', icon: '🚚', path: '/shipments' },
        { id: 'ai', label: 'AI Predictions', icon: '🤖', path: '/predictions' },
        { id: 'alerts', label: 'Alerts', icon: '🔔', path: '/alerts' },
        { id: 'reports', label: 'Reports', icon: '📈', path: '/reports' },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    ];

    const handleMenuClick = (item) => {
        setActiveItem(item.id);
        navigate(item.path);
    };

    return (
        <aside className="w-64 bg-gray-900 text-white relative h-screen overflow-y-auto">
        
            <div className="p-6 border-b border-gray-700">
                <div className="flex flex-row items-center gap-2 text-xl font-bold">
                <span>💊</span> DST
                </div>
            </div>


            <nav className="p-4 space-y-2">
                {menuItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeItem === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                        {item.badge}
                    </span>
                    )}
                </button>
                ))}
            </nav>
        </aside>
    );
}
