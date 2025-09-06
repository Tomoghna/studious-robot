import React, {useState} from "react";

const AddressesTab = ({setFormChanged}) => {
    const [addresses, setAddresses] = useState([
        {id: 1, address: "123 Main St, Springfield, IL", isDefault: true},
    ]);
    const [newAddress, setNewAddress] = useState("");

    const handleAdd = () => {
        if(newAddress.trim()) {
            setAddresses([
                ...addresses,
                {id: Date.now(), address: newAddress, isDefault: false},
            ]);
            setNewAddress("");
            setFormChanged(true);
        }
    };

    const handleDefault = (id) => {
        setAddresses(addresses.map(addr =>
            ({...addr, isDefault: addr.id === id})
        ));
        setFormChanged(true);
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Saved Addresses</h2>
            <ul>
                {addresses.map(addr => (
                    <li key={addr.id} className="flex items-center gap-2 border-b py-2">
                        <input type="radio" checked={addr.isDefault} onChange={() => handleDefault(addr.id)} name="defaultAddress"/>
                        <span>{addr.address}</span>
                        {addr.isDefault && <span className="text-xs text-blue-600">(Default)</span>}
                    </li>
                ))}
            </ul>
            <div className="mt-4 flex gap-2">
                <input type="text" className="flex-1 p-2 border rounded" placeholder="Add new address" value={newAddress} onChange={e => setNewAddress(e.target.value)}/>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAdd}>Add</button>
            </div>
        </div>
    );
};

export default AddressesTab;