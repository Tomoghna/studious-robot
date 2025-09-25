import React, {useState} from "react";

const STATES = [
    {name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur"]},
    {name: "Delhi", cities: ["New Delhi", "Dwarka", "Rohini"]},
    {name: "Karnataka", cities: ["Bengaluru", "Mysuru", "Mangalore"]},
    {name: "West Bengal", cities: ["Kolkata", "Howrah", "Durgapur", "Barddhaman", "Memari"]},
];

const initialForm = {
    fullName: "",
    address1: "",
    address2: "",
    state: "",
    city: "",
    pin: "",
    phone: "",
    email: "",
};

const AddressesTab = ({setFormChanged}) => {
    const [addresses, setAddresses] = useState([
        {
            id: 1, 
            ...initialForm,
            fullName: "John Doe",
            address1: "123 Main St",
            address2: "Apt 4B",
            state: "Maharashtra",
            city: "Mumbai",
            pin: "400001",
            phone: "9876543210",
            email: "john@dingdong.com", 
            isDefault: true,
        },
    ]);
    const [form, setForm] = useState(initialForm);
    const [newAddressOpen, setNewAddressOpen] = useState(false);

    const handleInput = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
        setFormChanged(true);
    };

    const handleStateChange = (e) => {
        setForm((prev) => ({
            ...prev,
            state: e.target.value,
            city: "",
        }));
        setFormChanged(true);
    };

    const handleAdd = () => {
        if (
            form.fullName &&
            form.address1 &&
            form.state &&
            form.city &&
            form.pin &&
            form.phone &&
            form.email
        ) {
            setAddresses([
                ...addresses,
                {...form, id: Date.now(), isDefault: false},
            ]);
            setForm(initialForm);
            setNewAddressOpen(false);
            setFormChanged(true);
        }
    };

    const handleDefault = (id) => {
        setAddresses(addresses.map(addr =>
            ({...addr, isDefault: addr.id === id})
        ));
        setFormChanged(true);
    };

    const selectedState = STATES.find((s) => s.name === form.state);

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Saved Addresses</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                {addresses.map(addr => (
                    <div key={addr.id} className={`border rounded-lg p-4 shadow-sm relative ${addr.isDefault ? "border-blue-600" : "border-gray-300"}`}>
                        <div className="absolute top-2 right-2">
                            <input type="radio" checked={addr.isDefault} onChange={() => handleDefault(addr.id)} name="defaultAddress" className="accent-blue-600"/>
                        </div>
                        <div className="font-semibold">{addr.fullName}</div>
                        <div>{addr.address1}</div>
                        {addr.address2 && <div>{addr.address2}</div>}
                        <div>
                            {addr.city}, {addr.state} - {addr.pin}
                        </div>
                        <div>Phone: {addr.phone}</div>
                        <div>Email: {addr.email}</div>
                        {addr.isDefault && (
                            <div className="text-xs text-blue-600 mt-2">(Default Address)</div>
                        )}
                    </div>
                ))}
            </div>
            <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setNewAddressOpen((open) => !open)}>
                {newAddressOpen ? "Cancel" : "Add New Address"}
            </button>
            {newAddressOpen && (
                <div className="bg-slate-950 p-4 rounded-lg shadow mb-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Full Name</label>
                            <input type="text" name="fullName" className="w-full p-2 border rounded" value={form.fullName} onChange={handleInput}/>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Phone Number</label>
                            <input type="tel" name="phone" className="w-full p-2 border rounded" value={form.phone} onChange={handleInput}/>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Email Address</label>
                            <input type="email" name="email" className="w-full p-2 border rounded" value={form.email} onChange={handleInput}/>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Pin Code</label>
                            <input type="text" name="pin" className="w-full p-2 border rounded" value={form.pin} onChange={handleInput}/>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Address Line 1</label>
                            <input type="text" name="address1" className="w-full p-2 border rounded" value={form.address1} onChange={handleInput}/>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Address Line 2</label>
                            <input type="text" name="address2" className="w-full p-2 border rounded" value={form.address2} onChange={handleInput}/>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">State</label>
                            <select name="state" className="w-full p-2 border rounded" value={form.state} onChange={handleStateChange}>
                                <option value="">Select State</option>
                                {STATES.map((state) => (
                                    <option key={state.name} value={state.name}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">City</label>
                            <select name="city" className="w-full p-2 border rounded" value={form.city} onChange={handleInput} disabled={!form.state}>
                                <option value="">Select City</option>
                                {selectedState && selectedState.cities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Save Address</button>
                </div>
            )}
        </div>
    );
};

export default AddressesTab;