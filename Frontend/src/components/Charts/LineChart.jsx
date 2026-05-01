import React from 'react';
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const CustomTooltip = (props) => {
    const { active, payload, label } = props;
    const data = payload && payload.length ? payload[0].payload : null;
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "white",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "6px"
                }}
                className="text-lg text-gray-900"
            >
                <p style={{ margin: 0, fontWeight: "bold" }}>
                    {data.name}
                </p>
                <p style={{ margin: 0 }}>
                    Orders: {data.orders}
                </p>
            </div>
        );
    }
    return null;
};

export default function LineChart({ data, title }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {title}
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="name"
                        angle={-30}
                        textAnchor="end"
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: "#ccc", strokeWidth: 1 }}
                    />

                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}