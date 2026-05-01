import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";

export default function Forecast() {
    const user = localStorage.getItem('role');
    const location_id = localStorage.getItem('location_id');

    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user !== 'hospital') {
            alert('You are not authorized to access this page.');
            window.location.href = '/';
        }
    }, [user]);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `http://localhost:8000/api/data/forecast/${location_id}`
                );

                const data = await res.json();
                setForecastData(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchForecast();
    }, [location_id]);

    return (
        <DashboardLayout
            dashboardTitle="Forecast"
            dashboardSubtitle="View and manage your hospital's forecast."
            userRole="Hospital Admin"
            userName="John Doe"
        >
            <div className="mt-10 px-4 py-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Forecast
                </h2>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : forecastData.length === 0 ? (
                    <p className="text-gray-500">No forecast data available.</p>
                ) : (
                    <table className="w-full border text-gray-700">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">Drug</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Predicted Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forecastData.map((item, index) => (
                                <tr key={index} className="text-center border-t">
                                    <td className="p-2">{item.drug_name}</td>
                                    <td className="p-2">
                                        {new Date(item.forecast_date).toLocaleDateString()}
                                    </td>
                                    <td className="p-2">{item.predicted_qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}