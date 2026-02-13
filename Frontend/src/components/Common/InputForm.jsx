import { useState } from "react";

export default function InputForm({ fieldValues, onSubmit }) {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onSubmit(form);
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        }
        setLoading(false);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {fieldValues.map(({ label, name, type, options }) => (
                <div key={name} className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                        {label}
                    </label>
                    {type === 'select' ? (
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id={name}
                            name={name}
                            onChange={handleChange}
                        >
                            {options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id={name}
                            type={type}
                            name={name}
                            onChange={handleChange}
                        />
                    )}
                </div>
            ))}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Submit'}
            </button>
        </form>
    );
}