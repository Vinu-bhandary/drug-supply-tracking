import React, { useState, useRef, useEffect } from 'react';

export default function DropdownButton({ label, items = [] }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target)) {
            setOpen(false);
        }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={ref}>
        <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
            {label}
            <span>{open ? '▲' : '▼'}</span>
        </button>

        {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <ul className="py-2">
                {items.map((item, idx) => (
                <li key={idx}>
                    <button
                    onClick={item.onClick}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                        item.danger ? 'text-red-600' : 'text-gray-700'
                    }`}
                    >
                    {item.label}
                    </button>
                </li>
                ))}
            </ul>
            </div>
        )}
        </div>
    );
}
