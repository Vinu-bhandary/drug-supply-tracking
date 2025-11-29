export default function SideBar({ items }) {
    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <h2 className="text-2xl font-bold mb-6"></h2>
            <ul>
                {items && items.map((item, index) => (
                    <li key={index} className="mb-4 hover:bg-gray-700 p-2 rounded">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}