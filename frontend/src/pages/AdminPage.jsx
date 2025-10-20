import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useAuth } from '../contexts/AuthContext';

const API_URL = "http://localhost:8000"; // adjust if your backend runs elsewhere

const TABS = [
    { key: "upload", label: "Products" },
    { key: "users", label: "Users" },
    { key: "orders", label: "Orders" },
];

function ProductsTab({ onNotify }) {
    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", price: "", category: "", brand: "", stock: "" });

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/users/products`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setProducts(data.data.products || []);
            else onNotify && onNotify(data.message || 'Failed to fetch products', 'error');
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

    const handleCreate = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/admin/products/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                onNotify && onNotify(data.message, "success");
                setForm({ name: "", description: "", price: "", category: "", brand: "", stock: "" });
                fetchProducts();
            } else throw new Error(data.message || "Failed");
        } catch (err) { onNotify && onNotify(err.message || "Create failed", "error"); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this product?")) return;
        try {
            const res = await fetch(`${API_URL}/api/v1/admin/products/delete/${id}`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (res.ok) { onNotify && onNotify(data.message, "success"); fetchProducts(); }
            else throw new Error(data.message || "Delete failed");
        } catch (err) { onNotify && onNotify(err.message || "Delete failed", "error"); }
    };

    const startEdit = (p) => { setEditing(p._id); setForm({ name: p.name, description: p.description, price: p.price, category: p.category, brand: p.brand, stock: p.stock }); };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/admin/products/update/${editing}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ price: form.price, stock: form.stock }),
            });
            const data = await res.json();
            if (res.ok) { onNotify && onNotify(data.message, "success"); setEditing(null); fetchProducts(); }
            else throw new Error(data.message || "Update failed");
        } catch (err) { onNotify && onNotify(err.message || "Update failed", "error"); }
    };

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
                <Typography variant="h6" sx={{ mb: 1 }}>Create / Edit Product</Typography>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                    <TextField label="Name" value={form.name} onChange={handleChange('name')} fullWidth />
                    <TextField label="Category" value={form.category} onChange={handleChange('category')} fullWidth />
                    <TextField label="Brand" value={form.brand} onChange={handleChange('brand')} fullWidth />
                    <TextField label="Price" value={form.price} onChange={handleChange('price')} fullWidth />
                    <TextField label="Stock" value={form.stock} onChange={handleChange('stock')} fullWidth />
                    <TextField label="Description" value={form.description} onChange={handleChange('description')} multiline rows={2} fullWidth />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    {!editing ? (
                        <Button variant="contained" onClick={handleCreate}>Create Product</Button>
                    ) : (
                        <>
                            <Button variant="contained" onClick={handleUpdate}>Save</Button>
                            <Button variant="outlined" onClick={() => { setEditing(null); setForm({ name: "", description: "", price: "", category: "", brand: "", stock: "" }); }}>Cancel</Button>
                        </>
                    )}
                </Box>
            </Paper>

            <Paper elevation={1} sx={{ p: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(p => (
                            <TableRow key={p._id} hover>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.price}</TableCell>
                                <TableCell>{p.stock}</TableCell>
                                <TableCell>{p.category}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => startEdit(p)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(p._id)} color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}

function UsersTab({ onNotify }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUserUidsFromOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/v1/admin/users/user`, {
                method: "GET",
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) {
                const usersSet = new Set(data.data.map(o => o));
                setUsers(Array.from(usersSet));
            } else {
                onNotify && onNotify(data.message || 'Failed to fetch orders', 'error');
            }
        } catch (err) { console.error(err); onNotify && onNotify('Network error', 'error'); }
        setLoading(false);
    };

    useEffect(() => { fetchUserUidsFromOrders(); }, []);

    const handleBan = async (uid) => {
        try {
            const res = await fetch(`${API_URL}/api/v1/admin/users/ban/${uid}`, { method: 'POST', credentials: 'include' });
            const data = await res.json();
            if (res.ok) onNotify && onNotify(data.message, 'success'); else throw new Error(data.message || 'Failed');
        } catch (err) { onNotify && onNotify(err.message || 'Ban failed', 'error'); }
    };

    const handleUnban = async (uid) => {
        try {
            const res = await fetch(`${API_URL}/api/v1/admin/users/unban/${uid}`, { method: 'POST', credentials: 'include' });
            const data = await res.json();
            if (res.ok) onNotify && onNotify(data.message, 'success'); else throw new Error(data.message || 'Failed');
        } catch (err) { onNotify && onNotify(data.message || 'Unban failed', 'error'); }
    };

    return (
        <Box>
            <Paper sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <Button variant="contained" onClick={fetchUserUidsFromOrders} disabled={loading}>Refresh Users</Button>
                </Box>
                {users.length === 0 ? <div>No users found (try refreshing)</div> : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>NAME</TableCell>
                                <TableCell>EMAIL</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleBan(user._uid)}><BlockIcon /></IconButton>
                                        <IconButton onClick={() => handleUnban(user._uid)}><LockOpenIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>
        </Box>
    );
}

function OrdersTab({ onNotify }) {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/admin/users/orders`, { credentials: 'include' });
            const data = await res.json();
            if (res.ok) setOrders(data.data || []);
            else onNotify && onNotify(data.message || 'Failed to fetch orders', 'error');
        } catch (err) { console.error(err); onNotify && onNotify('Network error', 'error'); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            const res = await fetch(`${API_URL}/api/v1/admin/users/order/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orderStatus: status })
            });
            const data = await res.json();
            if (res.ok) { onNotify && onNotify('Order updated', 'success'); fetchOrders(); }
            else throw new Error(data.message || 'Update failed');
        } catch (err) { onNotify && onNotify(err.message || 'Update failed', 'error'); }
    };

    return (
        <Box>
            <Paper sx={{ p: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(o => (
                            <TableRow key={o._id} hover>
                                <TableCell>{o._id}</TableCell>
                                <TableCell>{o.user?.name} ({o.user?.email})</TableCell>
                                <TableCell>{o.totalPrice}</TableCell>
                                <TableCell>{o.orderStatus}</TableCell>
                                <TableCell>
                                    <FormControl size="small" sx={{ minWidth: 140 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select label="Status" defaultValue={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                                            <MenuItem value="pending">pending</MenuItem>
                                            <MenuItem value="confirmed">confirmed</MenuItem>
                                            <MenuItem value="shipped">shipped</MenuItem>
                                            <MenuItem value="delivered">delivered</MenuItem>
                                            <MenuItem value="cancelled">cancelled</MenuItem>
                                            <MenuItem value="returned">returned</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState(0);
    const { showSnackbar } = useSnackbar();
    const { user } = useAuth();

    const onNotify = (message, variant = 'info') => showSnackbar(message, variant === 'error' ? 'error' : variant, 3000);

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <Typography variant="h4" sx={{ mb: 2 }}>Admin Dashboard {user ? `- ${user.name}` : ''}</Typography>
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} indicatorColor="primary" textColor="primary" variant="fullWidth">
                        {TABS.map((t, idx) => <Tab key={t.key} label={t.label} />)}
                    </Tabs>
                </Paper>

                <Box>
                    {activeTab === 0 && <ProductsTab onNotify={onNotify} />}
                    {activeTab === 1 && <UsersTab onNotify={onNotify} />}
                    {activeTab === 2 && <OrdersTab onNotify={onNotify} />}
                </Box>
            </div>
        </>
    );
}