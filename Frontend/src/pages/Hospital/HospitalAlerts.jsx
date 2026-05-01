import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";

export default function HospitalAlerts() {
    const user = localStorage.getItem('role');
    useEffect(() => {
        if (user !== 'hospital') {
        alert('You are not authorized to access this page.');
        window.location.href = '/';
        return;
        }
    })

    const [alerts, setAlerts] = useState([]);

    const location_id = localStorage.getItem("location_id");

    const fetchAlerts = async () => {
        const res = await fetch(
            `http://127.0.0.1:8000/api/data/alerts/${location_id}`
        );
        const data = await res.json();
        setAlerts(data);
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const markAsRead = async (id) => {
        await fetch(`http://127.0.0.1:8000/api/data/alerts/read/${id}`, {
            method: "POST",
        });

        fetchAlerts();
    };

    return (
        <DashboardLayout
            dashboardTitle="Alerts"
            dashboardSubtitle="Monitor inventory risks"
            userRole="Hospital Admin"
            userName="Hospital User"
        >
            <div className="bg-white p-6 rounded-xl shadow">

                <h2 className="text-lg font-semibold mb-4">All Alerts</h2>

                {alerts.length === 0 ? (
                    <p className="text-gray-500">No alerts</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-gray-600">
                                <th>Type</th>
                                <th>Drug</th>
                                <th>Batch</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map((a) => (
                                <tr key={a.id} className="border-b text-gray-800">

                                    <td>
                                        <span className={
                                            a.type === "EXPIRY_WARNING"
                                                ? "text-red-600 font-medium"
                                                : "text-yellow-600 font-medium"
                                        }>
                                            {a.type}
                                        </span>
                                    </td>

                                    <td>{a.drug}</td>
                                    <td>{a.batch}</td>
                                    <td>{a.message}</td>

                                    <td>
                                        {a.is_read ? "Read" : "Unread"}
                                    </td>

                                    <td>
                                        {!a.is_read && (
                                            <button
                                                onClick={() => markAsRead(a.id)}
                                                className="px-2 py-1 bg-blue-500 text-white rounded"
                                            >
                                                Mark Read
                                            </button>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}