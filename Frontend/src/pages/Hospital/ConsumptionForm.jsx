import { useState, useEffect } from "react";
import Select from "react-select";

export default function ConsumptionForm( row ) {
    const [formData, setFormData] = useState({
        drug: row.row.drug_id,
        batch: row.row.batch_id,
        qty_consumed: "",
        consumption_date: ""
    });



    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (selected, field) => {
        setFormData({
        ...formData,
        [field]: selected
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
        drug_id: formData.drug,
        location_id: localStorage.getItem("location_id"),
        batch_id: formData.batch || null,
        qty_consumed: Number(formData.qty_consumed),
        consumption_date: formData.consumption_date,
        recorded_by: localStorage.getItem("user_id")
        };

        const res = await fetch(`http://localhost:8000/api/data/consumption/${row.row.id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
        });

        if (res.ok) {
        alert("Consumption recorded!");
        setFormData({
            drug: row.row.drug_id,
            batch: row.row.batch_id,
            qty_consumed: "",
            consumption_date: ""
        });
        } else {
        alert("Error saving data");
        }
        window.location.reload();
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl text-gray-900">
        <h2 className="text-2xl font-semibold mb-6">Record Consumption</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

            <input type="text" 
            name="drug"
            placeholder="Drug Name"
            value={formData.drug}
            disabled
            />


            <input type="text" 
            name="batch"
            placeholder="Batch Number"
            value={formData.batch}
            disabled
            />


            <input
            type="number"
            name="qty_consumed"
            placeholder="Quantity Consumed"
            value={formData.qty_consumed}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            />


            <input
            type="date"
            name="consumption_date"
            value={formData.consumption_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            />


            <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
            Submit
            </button>

        </form>
        </div>
    );
}