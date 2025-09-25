import React, {useState} from "react";
import Navbar from "../components/Navbar";

const TABS = [
    {key: "upload", label: "upload Products"},
    {key: "categories", label: "Manage Categories"},
    {key: "orders", label: "Orders"},
];

function UploadProductsTab() {
    return (
        <div>
            <h2 className="text-xl semibold mb-4">Upload Products</h2>
            <div className="p-4 border rounded bg-gray-50">Product upload form coming soon...</div>
        </div>
    );
}

function ManageCategoriesTab() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
            <div classname="p-4 border rounded bg-gray-50">Category management coming soon...</div>
        </div>
    );
}

function OrdersTab() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <div className="p-4 border rounded bg-gray-50">Order management coming soon...</div> 
        </div>
    );
}

export default function AdmingPage() {
    const [activeTab, setActiveTab] = useState("upload");

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                <div className="flex border-b mb-6">
                    {TABS.map(tab => (
                        <button key={tab.key} className={`px-4 py-2 font-semibold ${activeTab === tab.key ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
                    ))}
                </div>
                <div classname="bg-white dark:bg-gray-900 rounded-lg shadow p-6 min-h-[300px]">
                    {activeTab === "upload" && <UploadProductsTab/>}
                    {activeTab === "categories" && <ManageCategoriesTab/>}
                    {activeTab === "orders" && <OrdersTab/>}
                </div>
            </div>
        </>
    );
}