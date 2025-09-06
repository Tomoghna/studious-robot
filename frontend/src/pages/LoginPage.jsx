import React, {useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import AccountInfoTab from "../components/account/AccountInfoTab";
import AddressesTab from "../components/account/AddressesTab";
import OrdersTab from "../components/account/OrdersTab";
import TrackOrderTab from "../components/account/TrackOrderTab";
import LoginForm from "../components/LoginForm";

const TABS = [
  {key: "account", label: "Account Info"},
  {key: "addresses", label: "Manage Addresses"},
  {key: "orders", label: "Orders"},
  {key: "track", label: "Track Orders"},
];

const LoginPage = () => {
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [formChanged, setFormChanged] = useState(false);

  if(user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p>Please log in to manage your account, track your orders, and add addresses.</p>
        <div className="mt-6 max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setFormChanged(false);
  };

  const handleCancel = () => {
    setFormChanged(false);
  };

  return (
    <div className="container max-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Account Management</h1>
      <div className="flex border-b mb-6">
        {TABS.map(tab => (
          <button key={tab.key} className={`px-4 py-2 font-semibold ${activeTab === tab.key ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 min-h-[300px]">
        {activeTab === "account" && <AccountInfoTab setFormChanged={setFormChanged}/>}
        {activeTab === "addresses" && <AddressesTab setFormChanged={setFormChanged}/>}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "track" && <TrackOrderTab />}
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={handleCancel} disabled={!formChanged}>Cancel</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleSave} disabled={!formChanged}>Save Changes</button>
      </div>
    </div>
  );
};

export default LoginPage;