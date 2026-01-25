import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('dashboard');

    const user = localStorage.getItem('role');

    const adminMenu = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
        { id: 'orders', label: 'Orders Overview', icon: '🛒', path: '/admin/orders'},
        { id: 'users', label: 'User Management', icon: '⚙️', path: '/admin/users' },  
        { id: 'locations', label: 'Location Management', icon: '📍', path: '/admin/locations' },
        { id: 'drugs', label: 'Drug Management', icon: '💊', path: '/admin/drugs' },
    ];         

    const vendorMenu = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/vendor/dashboard' },
        { id: 'products', label: 'Product Catalog', icon: '📦', path: '/vendor/products' },
        { id: 'orders', label: 'Orders Overview', icon: '🛒', path: '/vendor/orders' },
        { id: 'shipments', label: 'Shipments', icon: '🚚', path: '/vendor/shipments' },
        { id: 'analytics', label: 'Sales Analytics', icon: '📈', path: '/vendor/analytics' },
    ];

    const hospitalMenu = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/hospital/dashboard' },
        { id: 'inventory', label: 'Inventory', icon: '📦', path: '/hospital/inventory' },
        { id: 'orders', label: 'Orders Overview', icon: '🛒', path: '/hospital/orders' },
        { id: 'ai', label: 'AI Predictions', icon: '🤖', path: '/hospital/predictions' },
        { id: 'alerts', label: 'Alerts', icon: '🔔', path: '/hospital/alerts' },
        { id: 'reports', label: 'Reports', icon: '📈', path: '/hospital/reports' },
    ];

    let menuItems = adminMenu;

    if (user === 'vendor') {
        menuItems = vendorMenu;
    } else if (user === 'hospital') {
        menuItems = hospitalMenu;
    }

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
