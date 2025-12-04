import React, { useState, useRef, useEffect } from 'react';

export default function Topbar({ title, subtitle, userRole, userName }) {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
        if (notifRef.current && !notifRef.current.contains(e.target)) {
            setNotificationsOpen(false);
        }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">

            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{subtitle}</p>
            </div>

            <div className="flex items-center gap-6">

                <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border border-gray-300 rounded-lg w-48 focus:outline-none focus:border-blue-500"
                />


                <div className="relative" ref={notifRef}>
                <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative text-gray-600 hover:text-gray-900"
                >
                    🔔
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                    </span>
                </button>
                {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                    <p className="font-semibold text-gray-900 mb-3">Notifications</p>
                    <div className="space-y-2">
                        <div className="p-2 bg-yellow-50 rounded text-sm">Low stock alert</div>
                        <div className="p-2 bg-red-50 rounded text-sm">Expiry alert</div>
                        <div className="p-2 bg-blue-50 rounded text-sm">Order confirmed</div>
                    </div>
                    </div>
                )}
                </div>


                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {userName?.substring(0, 2)?.toUpperCase()}
                </div>
                <div className="text-sm">
                    <p className="font-semibold text-gray-900">{userName}</p>
                    <p className="text-gray-600">{userRole}</p>
                </div>
                </div>
            </div>
        </header>
    );
}
