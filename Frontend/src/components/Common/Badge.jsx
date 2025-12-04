import React from 'react';

export default function Badge({ text, type = 'default' }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delayed: 'bg-orange-100 text-orange-800',
        default: 'bg-gray-100 text-gray-800',
    };

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[type]}`}>
        {text}
        </span>
    );
}
