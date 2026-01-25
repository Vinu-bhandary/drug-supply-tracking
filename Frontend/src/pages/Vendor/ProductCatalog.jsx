import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import GenericTable from "../../components/Tables/GenericTable";

export default function ProductCatalog() {
    const user = localStorage.getItem("role");
    useEffect(() => {
        if (user !== 'vendor') {
            alert("You are not authorized to access this page.");
            window.location.href = "/";
            return;
        }
    })
    const [products, setProducts] = useState([]);

    return (
        <DashboardLayout dashboardTitle="Product Catalog" dashboardSubtitle="View and manage your product catalog.">
            <GenericTable
            data={products}
            columns={[
                { key: 'productName', label: 'Product Name' },
                { key: 'category', label: 'Category' },
                { key: 'price', label: 'Price' },
                { key: 'stock', label: 'Stock' },
            ]} 
            actions={[]}
        />
        </DashboardLayout>
    );
}