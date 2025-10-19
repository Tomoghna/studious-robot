import React, {useState} from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";

const API_URL = "http://localhost:8000";

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
    const { user, fetchUser } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [form, setForm] = useState(initialForm);
    const [newAddressOpen, setNewAddressOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

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

    const handleAdd = async () => {
        if (
            form.fullName &&
            form.address1 &&
            form.state &&
            form.city &&
            form.pin &&
            form.phone &&
            form.email
        ) {
            try {
                const res = await fetch(`${API_URL}/api/v1/users/updateprofile`, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: user.name || '', newAddress: {
                        street: form.address1 + (form.address2 ? ' ' + form.address2 : ''),
                        city: form.city,
                        state: form.state,
                        zip: form.pin,
                        defaultAddress: false
                    }, phone: user.phone || '' })
                });
                const data = await res.json();
                if (res.ok) {
                    showSnackbar('Address added', 'success');
                    await fetchUser();
                    setForm(initialForm);
                    setNewAddressOpen(false);
                    setFormChanged(false);
                } else {
                    showSnackbar(data.message || 'Failed to add address', 'error');
                }
            } catch (err) {
                console.error(err);
                showSnackbar('Network error', 'error');
            }
        }
    };

    const handleDefault = async (id) => {
        // Not implemented on backend directly; could implement as separate API. For now, update locally by calling fetchUser to refresh.
        showSnackbar('Set default address feature not implemented on backend', 'info');
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this address?')) return;
        try {
            const res = await fetch(`${API_URL}/api/v1/users/deleteaddress/${id}`, { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (res.ok) {
                showSnackbar('Address deleted', 'success');
                await fetchUser();
            } else showSnackbar(data.message || 'Delete failed', 'error');
        } catch (err) { console.error(err); showSnackbar('Network error', 'error'); }
    };

    const startEdit = (addr) => {
        setEditingId(addr._id || addr.id);
        // parse street into address1/address2 if possible
        const [address1, address2] = (addr.street || addr.address1 || '').split('\n');
        setForm({ fullName: addr.fullName || addr.name || '', address1: address1 || '', address2: address2 || '', state: addr.state || '', city: addr.city || '', pin: addr.zip || addr.pin || '', phone: addr.phone || '', email: addr.email || '' });
        setNewAddressOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        try {
            const res = await fetch(`${API_URL}/api/v1/users/updateaddress/${editingId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: { street: form.address1 + (form.address2 ? '\n' + form.address2 : ''), city: form.city, state: form.state, zip: form.pin } })
            });
            const data = await res.json();
            if (res.ok) {
                showSnackbar('Address updated', 'success');
                await fetchUser();
                setEditingId(null);
                setNewAddressOpen(false);
            } else showSnackbar(data.message || 'Update failed', 'error');
        } catch (err) { console.error(err); showSnackbar('Network error', 'error'); }
    };

    const selectedState = STATES.find((s) => s.name === form.state);

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Saved Addresses</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                {(user?.address || []).map(addr => (
                    <div key={addr._id || addr.id} className={`border rounded-lg p-4 shadow-sm relative ${addr.defaultAddress ? "border-blue-600" : "border-gray-300"}`}>
                        <div className="absolute top-2 right-2">
                            <input type="radio" checked={addr.defaultAddress} onChange={() => handleDefault(addr._id || addr.id)} name="defaultAddress" className="accent-blue-600"/>
                        </div>
                        <div className="font-semibold">{addr.fullName || user.name}</div>
                        <div>{addr.street || addr.address1}</div>
                        {addr.address2 && <div>{addr.address2}</div>}
                        <div>
                            {addr.city}, {addr.state} - {addr.zip || addr.pin}
                        </div>
                        <div>Phone: {addr.phone}</div>
                        <div>Email: {addr.email || user.email}</div>
                        {addr.defaultAddress && (
                            <div className="text-xs text-blue-600 mt-2">(Default Address)</div>
                        )}
                        <div className="mt-2 flex gap-2">
                            <button className="px-3 py-1 bg-gray-100 rounded" onClick={() => startEdit(addr)}>Edit</button>
                            <button className="px-3 py-1 bg-red-100 text-red-700 rounded" onClick={() => handleDelete(addr._id || addr.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => { setNewAddressOpen((open) => !open); setEditingId(null); }}>
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
                    <div className="mt-4 flex gap-2">
                        {editingId ? (
                            <>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSaveEdit}>Save Changes</button>
                                <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setEditingId(null); setNewAddressOpen(false); setForm(initialForm); }}>Cancel</button>
                            </>
                        ) : (
                            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Save Address</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressesTab;