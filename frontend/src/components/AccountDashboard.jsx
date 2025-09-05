import React from "react";
import { Link } from "react-router-dom";

const AccountDashboard = () => {
    return (
        <div classname="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Account Dashboard</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Account Information</h2>
                <p className="text-gray-700">Manage your account details here.</p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold">Your Orders</h2>
                <p className="text-gray-700">Track your past orders.</p>
                <Link to="/orders" className="text-blue-500 hover:underline">View Orders</Link>
            </div>

            <div>
                <h2 className="text-xl font-semibold">Manage Addresses</h2>
                <p className="text-gray-700">Add or edit your saved addresses.</p>
                <Link to="/addressses" className="text-blue-500 hover:underline">Manage Addresses</Link>
            </div>
        </div>
    );
};

export default AccountDashboard;