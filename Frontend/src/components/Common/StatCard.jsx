import React from 'react';

export default function StatCard({ label, value, icon, color = 'blue', change }) {
    const borderColors = {
        blue: 'border-l-blue-500',
        yellow: 'border-l-yellow-500',
        red: 'border-l-red-500',
        green: 'border-l-green-500',
        purple: 'border-l-purple-500',
    };

    return (
        <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${borderColors[color]}`}>
        <div className="flex items-center justify-between">
            <div>
            <p className="text-gray-600 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
                <p className="text-sm text-green-600 mt-2">
                {change.includes('-') ? '📉' : '📈'} {change}
                </p>
            )}
            </div>
            <span className="text-4xl">{icon}</span>
        </div>
        </div>
    );
}
