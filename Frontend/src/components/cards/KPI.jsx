export default function KPI({ title, value }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-h-32 w-48">
            <h2 className="text-gray-600 text-sm font-medium">{title}</h2>
            <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
        </div>
    );
}