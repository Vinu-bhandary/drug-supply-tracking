import React from 'react';
import Badge from '../Common/Badge';

export default function GenericTable({ columns, data, actions }) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                {columns.map(col => (
                    <th
                    key={col.key}
                    className="px-6 py-3 text-left font-semibold text-gray-700"
                    >
                    {col.label}
                    </th>
                ))}
                {actions && <th className="px-6 py-3 text-right font-semibold text-gray-700">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((row, idx) => (
                <tr key={row.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                    {columns.map(col => (
                    <td key={col.key} className="px-6 py-3 text-gray-700">
                        {col.date ? <Badge text={new Date(row[col.key]).toLocaleDateString('en-IN')} /> : col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                    ))}
                    {actions && (
                    <td className="px-6 py-3 text-right">
                        {actions(row)}
                    </td>
                    )}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}
