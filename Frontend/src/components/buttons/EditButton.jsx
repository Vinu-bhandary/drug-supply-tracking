export default function EditButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
        >
            Edit
        </button>
    );
}