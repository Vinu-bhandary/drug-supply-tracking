import { useState, useEffect } from 'react';
import Select from 'react-select';

export default function OrderForm({ onSubmit }) {

    const [vendor, setVendor] = useState(null);
    const [vendorOptions, setVendorOptions] = useState([]);

    const [formData, setFormData] = useState([
        { drug: null, quantity: "" }
    ]);

    const [drugOptions, setDrugOptions] = useState([]);
    const [errors, setErrors] = useState([]);


    useEffect(() => {
        const fetchData = async () => {

            const [drugRes, vendorRes] = await Promise.all([
                fetch('http://localhost:8000/api/seed/drugs'),
                fetch('http://localhost:8000/api/seed/vendors')
            ]);

            const drugs = await drugRes.json();
            const vendors = await vendorRes.json();

            setDrugOptions(
                drugs.map(d => ({ label: d.name, value: d.id }))
            );

            setVendorOptions(
                vendors.map(v => ({ label: v.name, value: v.id }))
            );
        };

        fetchData();
    }, []);


    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...formData];
        updated[index][name] = value;
        setFormData(updated);

        const newErrors = [...errors];
        if (name === 'quantity' && (isNaN(value) || value <= 0)) {
            newErrors[index] = 'Quantity must be a positive number';
        } else {
            newErrors[index] = null;
        }
        setErrors(newErrors);
    };

    const handleDrugChange = (selected, index) => {
        const updated = [...formData];
        updated[index].drug = selected;
        setFormData(updated);
    };

    const addItem = () => {
        setFormData([...formData, { drug: null, quantity: "" }]);
    };

    const removeItem = (index) => {
        setFormData(formData.filter((_, i) => i !== index));
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!vendor) {
            alert("Please select a vendor first");
            return;
        }

        let valid = true;
        const newErrors = [];

        formData.forEach((item, index) => {
            if (!item.drug) {
                newErrors[index] = "Please select a drug";
                valid = false;
            } else if (!item.quantity || Number(item.quantity) <= 0) {
                newErrors[index] = "Should be more than 0";
                valid = false;
            } else {
                newErrors[index] = "";
            }
        });

        setErrors(newErrors);
        if (!valid) return;

        const payload = {
            created_by_id: localStorage.getItem('user_id'),
            vendor_id: vendor.value,
            items: formData.map(item => ({
                drug_id: item.drug.value,
                quantity: Number(item.quantity)
            }))
        };

        onSubmit(payload);
    };

    return (
        <form className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6" onSubmit={handleSubmit}>

            <h3 className="text-2xl font-semibold text-gray-800">Place Order</h3>


            <div>
                <label className="block mb-2 text-gray-700">Select Vendor</label>
                <Select
                    options={vendorOptions}
                    value={vendor}
                    onChange={setVendor}
                    placeholder="Choose Vendor..."
                    className="text-gray-900 rounded-lg"
                />
            </div>


            {!vendor && (
                <p className="text-sm text-gray-500">
                    Please select a vendor to add items
                </p>
            )}

            {vendor && formData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">

                    <div className="w-64 text-gray-600">
                        <Select
                            options={drugOptions}
                            value={item.drug}
                            onChange={(selected) => handleDrugChange(selected, index)}
                            placeholder="Search Drug..."
                        />
                    </div>

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleChange(index, e)}
                        className="w-32 px-3 py-2 border text-gray-900 rounded-lg"
                    />

                    {errors[index] && (
                        <p className="text-red-500 text-sm">{errors[index]}</p>
                    )}

                    {formData.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg"
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}

            {vendor && (
                <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    + Add Item
                </button>
            )}

            <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-lg"
            >
                Submit Order
            </button>

        </form>
    );
}