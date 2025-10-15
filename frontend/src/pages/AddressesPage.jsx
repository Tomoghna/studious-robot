import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const AddressesPage = () => {
  const { user } = useContext(AuthContext);

  if (!user.isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl">Please log in to manage your addresses.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Your Addresses</h1>
      {/* Address management functionality will go here */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Saved Addresses</h2>
        {/* List of saved addresses */}
        <ul>
          {/* Example address item */}
          <li className="border-b py-2">123 Main St, Springfield, IL</li>
          {/* More addresses can be mapped here */}
        </ul>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add New Address</button>
      </div>
    </div>
  );
};

export default AddressesPage;